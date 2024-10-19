import express, {Router, Request, Response} from "express";
import {getAllUsers, getuserId, userSignUp, userLogin, deleteAccount, updateUser} from '../controllers/getAllUsers';
import { addRecentStay } from "../controllers/addRecentStay";
import { bookHotel, cancelBooking } from '../controllers/bookingController';
import User from "../models/user";
const router: Router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getuserId);
router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.delete("/delete/:id", deleteAccount);
router.put("/update/:id", updateUser);
router.post("/addrecentstay", addRecentStay);
router.post("/bookhotel", bookHotel);
router.post("/cancelhotel", cancelBooking);
export default router;