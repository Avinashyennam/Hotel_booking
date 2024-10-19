import express, {Request, Response, Router} from "express";
import { addHotel, getHotel } from "../controllers/getHotel";
const router: Router = express.Router();
router.post("/addhotel", addHotel);
router.get("/gethotels", getHotel);
export default router;