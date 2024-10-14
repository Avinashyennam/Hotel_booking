import express, {Router, Request, Response} from "express";
import {getAllUsers, getuserId, userSignUp, userLogin, deleteAccount, updateUser} from '../controllers/getAllUsers';
import User from "../models/user";
const router: Router = express.Router();

router.get("/", getAllUsers);
router.get("/:id", getuserId);
router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.delete("/delete/:id", deleteAccount);
router.put("/update/:id", updateUser);
export default router;