import Item from "../models/item.js";
import {checkIsAdmin} from "./userController.js";

//add a new item
export const addItem = async (req, res) => {
    try {

        //check if the user is logged in
        if(req.user == null){
            res.status(401).json({
                //Inform the user to log in
                "message": "Pleas log in and try again"
            });
            return;
        }

        //check if the user has admin previliges
        if(checkIsAdmin(req) === false){
            res.status(403).json({
                //return a forbidden message
                "message":"You are unauthorized to add items"
            });
            return;
        }
        //fetch item data from request body
        const itemData = req.body;

        //create new item object
        const newItem = new Item(itemData);

        await newItem.save();

        res.json(itemData);

    } catch (err) {
        res.status(500).json({
            "message": "Error adding item",
            error: err.message
        });
    }
}

//find all items
export const findAllItems = async (req, res) => {
    console.log(req.user);
    try {
        if(checkIsAdmin(req)){
            //if the user is an admin retrieve all products
            const items = await Item.find();
            res.json(items);
        }else{
            //If the user is not an admin, retrieve only available products
            const items=await Item.find({availability: true});
            res.json(items);
        }
    } catch (err) {
        res.status(500).json({
            "message": "Error findAllItems",
            error: err.message
        });
    }
}

//find item by id
export const findItemById = async (req, res) => {
    try {
        //fetch 'itemId' from request parameters
        const itemId = req.params.itemId;

        //fetch existing item
        const existingItem = await Item.findOne({itemId: itemId});

        //check if the item is existing
        if(!existingItem){
            res.status(404).json({
                "message":"Item not found"
            });
            return;
        }

        // console.log("Item Id: ",itemId);
        res.json(existingItem);

    } catch (err) {
        res.status(500).json({
            "message": "error finding item",
            "error": err.message
        });
    }
}

//update item
export const updateItem = async (req, res) => {
    try {
        if(checkIsAdmin(req)){
            //fetch item id from req
            const id = req.params.itemId;

            //get the updated product data from request body
            const data = req.body;

            //fetch current item details from the database
            const existingItem = await Item.findOne({itemId: id});

            //check if an item exists for provided id
            if (!existingItem) {
                res.status(404).json({
                    message: "Item not found"
                });
                return;
            }

            //determine the new stock count
            const updateStock=data.stock !==undefined ? data.stock : existingItem.stock;

            //update availability based on stock
            data.availability = updateStock>0;

            //update item in the database
            const updatedItem=await Item.findOneAndUpdate({itemId:id},data,{new:true,runValidators:true});

            res.json({
                message: "Item updated successfully",
                updatedItem
            });
        }else{
            res.status(403).json({
                "message":"You are unauthorized to update item"
            });
        }
    } catch (err) {
        //Handle errors during the update operation
        res.status(500).json({
            "message": "Error updating item",
            "error": err.message
        });
    }
}

export const deleteItem= async (req,res)=>{
    try{
        if(checkIsAdmin(req)){
            //fetch the product key from the request parameters
            const id=req.params.itemId;

            //find the item from existing database
            const existingItem=await Item.findOne({itemId:id});

            if(!existingItem) {
                res.status(404).json({
                    "message":"Item not found"
                });
                return;
            }
            //delete the product from the database with the provided key
            await Item.deleteOne({itemId:id});

            //respond with a success message when the product is deleted
            res.json({
                "message":"Item deleted successfully"
            });
        }else{
            res.status(403).json({
                "message":"You are unauthorized to delete item"
            });
        }

    }catch (e){
        //Handle errors during the deletion process
        res.status(500).json({
            "message":"Error deleting item"
        });
    }
}