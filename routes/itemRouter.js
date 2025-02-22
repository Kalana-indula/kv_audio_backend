import express from "express";
import {addItem, findAllItems, findItemById} from "../controller/itemController.js";

//creating an itemRouter object
const itemRouter = express.Router();

itemRouter.post("/",addItem);
itemRouter.get("/",findAllItems);
itemRouter.get("/:itemId",findItemById);

export default itemRouter;