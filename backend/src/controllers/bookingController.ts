import { Request, Response } from 'express';
import Booking from '../models/booking'; // Adjust to the correct path
import Hotel from '../models/hotel'; // Hotel model
import User from '../models/user'; // User model

export const bookHotel = async (req: Request, res: Response) => {
    try {
        const { userId, hotelId, checkInDate, checkOutDate, guests } = req.body;

        /* 
            {
                "userId": "670d165b367b820aaa49ccae",
                "hotelId": "670ce2319d123b01ad1c46eb",
                "checkInDate": "2024-10-22",
                "checkOutDate": "2024-10-25",
                "guests": 2
            }
        */

        // Validate the booking dates
        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            res.status(400).json({ message: 'Check-out date must be later than check-in date.' });
            return;
        }

        // Check if the hotel exists
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found.' });
            return;
        }

        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ message: 'User not found.' });
            return;
        }

        // Example logic: Check if hotel is available for the given dates
        // This could include querying the `Booking` model to see if there are any conflicts.
        const conflictingBookings = await Booking.find({
            hotel: hotelId,
            $or: [
                { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
                { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } }
            ]
        });

        if (conflictingBookings.length > 0) {
            res.status(400).json({ message: 'Hotel is not available for the selected dates.' });
            return;
        }

        // Create the booking
        const booking = new Booking({
            user: userId,
            hotel: hotelId,
            checkInDate,
            checkOutDate,
            guests
        });

        // Save the booking to the database
        await booking.save();
        // Update the user's recentStay array by adding the hotelId
        const userstays = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { recentStays: hotelId } }, // $addToSet ensures no duplicates
            { new: true } // Returns the updated user object
        );

        // Respond with the booking details
        res.status(201).json({
            message: 'Hotel booked successfully!',
            booking
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// for cancellation
// Retrieve the booking details based on the booking ID.
// Validate that the booking belongs to the requesting user.
// Ask for a reason for the cancellation.
// Mark the booking as "canceled" in the database and store the cancellation reason.

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId, userId, cancellationReason } = req.body;

        // Find the booking by ID and ensure the user matches
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            res.status(404).json({ message: 'Booking not found.' });
            return;
        }

        // Ensure that the booking belongs to the user who is trying to cancel
        if (booking.user.toString() !== userId) {
            res.status(403).json({ message: 'You do not have permission to cancel this booking.' });
            return;
        }

        // Check if the booking is already canceled
        if (booking.isCanceled) {
            res.status(400).json({ message: 'Booking is already canceled.' });
            return;
        }

        // Update the booking to mark it as canceled and store the cancellation reason
        booking.isCanceled = true;
        booking.cancellationReason = cancellationReason;

        // Save the updated booking
        await booking.save();

        // removing booked hotel from recent stays
        const userStaysAfterCancellation = await User.findByIdAndUpdate(
            userId,
            { $pull: { recentStays: booking.hotel } }, // $pull removes the hotelId from recentStays
            { new: true } // Returns the updated user object
        );
        res.status(200).json({
            message: 'Booking canceled successfully and hotel removed from recent stays.',
            booking,
            updatedUser: userStaysAfterCancellation
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
    }
};
