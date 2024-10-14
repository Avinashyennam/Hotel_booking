import express, {Request, Response, Router} from "express";
import { addHotel } from "../controllers/getHotel";
const router: Router = express.Router();
router.post("/addhotel", addHotel);

export default router;