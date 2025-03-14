import Inquiry from "../models/inquiry.js";
import {checkIsAdmin} from "./userController.js";

//add a new inquiry
export const addInquiry = async (req,res) => {
    try{
        //allow admins to add inquiries
        if(checkIsAdmin(req)){
            const data = req.body; //extract data from req.body
            data.email = req.user.email; // Use the admin's email from the request user object
            data.phone = req.user.phone; // Use the admin's phone from the request user object

            let id=0; //initializing inquiry id

            //Fetch the most recent inquiry to determine the next ID
            const inquiries= await Inquiry.find().sort({id:-1}).limit(1);
            if(inquiries.length === 0){
                id = 1; //Assign ID 1 if no inquiries exist
            }else{
                id = inquiries[0].id+1; //Increment the ID from the latest inquiry
            }

            data.id = id; // Assign the computed ID to the new inquiry

            //Create and save the new inquiry in the database
            const newInquiry = new Inquiry(data);
            const response = await newInquiry.save();

            //response with success message and new inquiry ID
            res.json({
                "message":"Inquiry added successfully",
                "id":response.id
            });
        }
    }catch(err){
        console.log(err.message); //Log error for debugging
        //Response with and error message
        res.status(500).json({
            "message":"Failed to add inquiry",
            "error":err.message
        });
    }
}