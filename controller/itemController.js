import Item from "../models/item.js";

//add a new item
export const addItem=async (req,res)=>{
    try{
        //fetch item data from request body
        const itemData=req.body;

        //create new item object
        const newItem=new Item(itemData);

        await newItem.save();

        res.json(itemData);

    }catch(err){
        res.status(500).json({
            "message":"Error adding item",
            error:err.message
        });
    }
}

//find all items
export const findAllItems=async (req,res)=>{
    try{
        //fetch all items
        const items=await Item.find();

        res.json(items);
    }catch(err){
        res.status(500).json({
            "message":"Error findAllItems",
            error:err.message
        });
    }
}

//find item by id
export const findItemById=async (req,res)=>{
    try{
        //fetch 'itemId' from request parameters
        const itemId=req.params.itemId;

        const existingItem=await Item.findOne({itemId: itemId});
        // console.log("Item Id: ",itemId);
        res.json(existingItem);
    }catch(err){
        res.status(500).json({
            "message":"error finding item",
            "error":err.message
        });
    }
}

//update item
export const updateItem=async (req,res)=>{
    try{
        //fetch itemId from request parameters
        const id=req.params.itemId;
        console.log(id);

        //find existing item
        const existingItem=Item.findOne({itemId: id});

        if(!existingItem){
            res.json({
                message:"Item does not exist"
            });
            return;
        }else{
            //fetch item data from request body
            const itemData=req.body;

            //update item with new item details
            await Item.updateOne({itemId: id},itemData);

            res.json({
                message:"Item updated successfully"
            });
            return;
        }
    }catch(err){
        //Handle errors during the update operation
        res.status(500).json({
            "message":"Error updating item",
            "error":err.message
        });
    }
}