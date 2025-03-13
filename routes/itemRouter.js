import express from "express";
import {addItem, deleteItem, findAllItems, findItemById, updateItem} from "../controller/itemController.js";

//creating an itemRouter object
const itemRouter = express.Router();

itemRouter.post("/",addItem);
itemRouter.get("/",findAllItems);
itemRouter.get("/:itemId",findItemById);
itemRouter.put("/:itemId",updateItem);
itemRouter.delete("/:itemId",deleteItem);

export default itemRouter;