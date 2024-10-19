import express, {Request, Response, Router} from "express";
import { addHotel, getHotels, updateHotel, deleteHotel, getHotel } from "../controllers/getHotel";
const router: Router = express.Router();
router.post("/addhotel", addHotel);
router.get("/gethotels", getHotels);
router.get("/gethotel/:id", getHotel);
router.patch("/updatehotel/:id", updateHotel);
router.delete("/deletehotel/:id", deleteHotel);
export default router;