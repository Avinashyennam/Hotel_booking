import mongoose, { Schema, Document } from 'mongoose';
// import { IUser } from './user';
export interface IBooking extends Document {
    user: mongoose.Schema.Types.ObjectId; // User ID
    hotel: mongoose.Schema.Types.ObjectId; // Hotel ID
    checkInDate: Date;
    checkOutDate: Date;
    guests: number;
    isCanceled: boolean; // To mark if the booking is canceled
    cancellationReason?: string; // Reason for cancellation (optional)
}

const bookingSchema: Schema<IBooking> = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guests: { type: Number, required: true },
    isCanceled: { type: Boolean, default: false }, // Initially not canceled
    cancellationReason: { type: String } // Stores the reason for cancellation
});

export default mongoose.model<IBooking>('Booking', bookingSchema);
