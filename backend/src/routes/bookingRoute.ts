import { Router } from 'express';
import { bookHotel } from '../controllers/bookingController';

const router = Router();

// Route to book a hotel
router.post('/book', bookHotel);

export default router;
