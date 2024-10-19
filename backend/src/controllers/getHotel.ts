import { Request, Response, NextFunction } from "express";
import Hotel from "../models/hotel";

// export const addHotel = async (req: Request, res: Response) => {
//     try {
//         const newHotel = new Hotel({
//             name: 'Grand Palace Hotel',
//             description: 'A luxurious stay with modern amenities.',
//             location: 'New York, USA',
//             price: 250,
//             images: ['image1.jpg', 'image2.jpg'],
//             amenities: [
//                 'Power Backup',
//                 'Elevator/Lift',
//                 'Refrigerator',
//                 'Housekeeping',
//                 'Room Service',
//                 'Smoke Detector',
//                 'Laundry Service',
//                 'Air Conditioning',
//                 'Free Wi-Fi',
//                 'Newspaper',
//                 'Free Parking',
//                 'Restaurant',
//                 'Dining Area'
//             ],
//             fits: 4
//         });

//         const savedHotel = await newHotel.save();
//         console.log('Hotel created successfully:', savedHotel);
//         res.status(200).json({savedHotel});
//         return;
//     } catch (error) {
//         console.error('Error creating hotel:', error);
//         res.status(500).json({message: "Internal server error"});
//     }
// }

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

export const getHotel = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json({hotels});
        return;
    } catch (error) {
        console.log("Error getting hotels", error);
        res.status(500).json({message: "server error"});
    }
}