import mongoose, { Schema, Document } from 'mongoose';

export interface IHotel extends Document {
    name: string;
    description: string;
    location: string;
    price: number;
    images: string[]; // Array of URLs or image paths
    amenities: string[]; // Array of amenities
    fits: number; // Number of people it fits
}

const hotelSchema: Schema<IHotel> = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], required: true }, // Array of image URLs
    amenities: { type: [String], required: true }, // List of amenities
    fits: { type: Number, required: true }, // Number of people it fits
});

// Example list of amenities for the hotel
// const amenitiesList = [
//     "Power Backup",
//     "Elevator/Lift",
//     "Refrigerator",
//     "Housekeeping",
//     "Room Service",
//     "Smoke Detector",
//     "Laundry Service",
//     "Air Conditioning",
//     "Free Wi-Fi",
//     "Newspaper",
//     "Free Parking",
//     "Restaurant",
//     "Dining Area"
// ];

const Hotel = mongoose.model<IHotel>('Hotel', hotelSchema);
export default Hotel;