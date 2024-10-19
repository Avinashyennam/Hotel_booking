import { Request, Response, NextFunction } from "express";
import User from '../models/user';
import Hotel from '../models/hotel';

// interface AddRecentStayRequest extends Request {
//     body: {
//         userId: string;
//         hotelId: string;
//     };
// }
export const addRecentStay = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, hotelId } = req.body;

        // check if hotel exists
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }

        // Update the user's recentStay array by adding the hotelId
        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { recentStays: hotelId } }, // $addToSet ensures no duplicates
            { new: true } // Returns the updated user object
        );

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        res.status(200).json({ message: 'Recent stay added successfully', user });
        return;
    } catch (error) {
        console.error('Error adding recent stay:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};