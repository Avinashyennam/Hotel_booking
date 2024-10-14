import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoute';
// Load environment variables
dotenv.config();
// Create an Express app
const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connecting to mongoDB
const mongoUri: string = process.env.MONGO_URI as string; // Use type assertion
const connectDB = async () => {
  try {
    if (!mongoUri) {
      throw new Error('Mongo URI is not defined in environment variables');
    }
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

connectDB();

// Define a route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
app.use("/api/users", userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
function then(arg0: () => void) {
  throw new Error('Function not implemented.');
}

