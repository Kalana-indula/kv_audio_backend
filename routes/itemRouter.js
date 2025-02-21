import express from "express";
import {addItem} from "../controller/itemController.js";

//creating an itemRouter object
const itemRouter = express.Router();

itemRouter.post("/",addItem);

export default itemRouter;