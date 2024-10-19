import { Request, Response, NextFunction } from "express";
import Hotel from "../models/hotel";
import { triggerAsyncId } from "async_hooks";

// route to creating new hotel
export const addHotel = async (req: Request, res: Response) => {
    try {
        // Destructuring hotel details from req.body
        const { name, description, location, price, images, amenities, fits } = req.body;

        // Create a new hotel instance
        const newHotel = new Hotel({
            name,
            description,
            location,
            price,
            images,
            amenities,
            fits
        });

        // Save the new hotel to the database
        await newHotel.save();

        // Respond with success message
        res.status(201).json({ message: 'Hotel added successfully', hotel: newHotel });
        return;
    } catch (error) {
        // Error handling
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};

// route to get all hotels
export const getHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({hotels});
        return;
    } catch (error) {
        console.log("Error getting hotels", error);
        res.status(500).json({message: "server error"});
    }
}

// route to get a specific hotel
export const getHotel = async (req: Request, res: Response):Promise<void> =>{
    try {
        const {id} = req.params;
        const hotel = await Hotel.findById(id);
        if(!hotel){
            res.status(404).json({message: "hotel not found"});
            return;
        }
        res.status(200). json({message: hotel});
    } catch (error) {
        console.log("error getting hotel", error);
        res.status(500).json({message: "Internal server error at getting hotel"});
    }
}

// route to update hotel
export const updateHotel = async (req: Request, res: Response):Promise<void> => {
    try {
        // Get the hotel id from the request parameters
        const { id } = req.params;

        // Get the fields to update from the request body
        const updates = req.body;

        // Find the hotel by ID and update the fields
        const updatedHotel = await Hotel.findByIdAndUpdate(id, updates, {
            new: true, // Returns the updated document
            runValidators: true // Ensures validations are run
        });

        // If the hotel was not found, return a 404
        if (!updatedHotel) {
            res.status(404).json({ message: 'Hotel not found' });
            return;
        }

        // Return the updated hotel data
        res.status(200).json({
            message: 'Hotel updated successfully',
            hotel: updatedHotel
        });
        return;
    } catch (error) {
        // Error handling
        console.error(error);
        res.status(500).json({ message: 'Server error', error });
        return;
    }
};

// route to delete a hotel
export const deleteHotel = async (req: Request, res: Response):Promise<void> => {
    try {
        const {id} = req.params;
        const deletedHotel = await Hotel.findByIdAndDelete(id);
        /* findByIdAndDelete: This method is used to find a document by its ID and delete it.
        It returns the deleted document, so you can check if the hotel existed before trying
        to delete it.
        */
        if(!deletedHotel){
            res.status(404).json({message: "Hotel not found"});
            return;
        }
        res.status(200).json({message: "Hotel deleted successfully"});
        return;
    } catch (error) {
        console.log("Error deleting hotel", error);
        res.status(500).json({message: "Internal server error at deleting hotel"});
    }
}