import Item from "../models/item.js";

//add a new item
export const addItem = async (req, res) => {
    try {
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
    try {
        //fetch all items
        const items = await Item.find();

        res.json(items);
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

        const existingItem = await Item.findOne({itemId: itemId});
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

    } catch (err) {
        //Handle errors during the update operation
        res.status(500).json({
            "message": "Error updating item",
            "error": err.message
        });
    }
}