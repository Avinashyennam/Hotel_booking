import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); // Email validation regex
            },
            message: (props: { value: string }) => `${props.value} is not a valid email!`
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8, // Optional: Ensure password has a minimum length
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
},
{
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
});

// Password hashing middleware before saving the user
// userSchema.pre<IUser>('save', async function (next) {
//     if (!this.isModified('password')) return next();

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });

// // Method to compare passwords
// userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
//     return bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model<IUser>('User', userSchema);

export default User;
