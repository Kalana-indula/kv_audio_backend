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