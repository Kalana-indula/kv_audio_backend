import Inquiry from "../models/inquiry.js";
import {checkIsAdmin, checkIsCustomer} from "./userController.js";

//add a new inquiry
export const addInquiry = async (req,res) => {
    try{
        //allow customers to add inquiries
        if(checkIsCustomer(req)){
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
        }else{
            res.status(403).json({
                "message":"Please login with authorized account"
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

//Function to retrieve inquiries based on user roles
export const getInquiries = async (req,res) =>{
    try{
        if(checkIsCustomer(req)){
            //fetch inquiries for a specific customer based on their email
            const inquiries = await Inquiry.find({email:req.user.email});
            res.json(inquiries);
        }else if(checkIsAdmin(req)){
            //fetch all inquiries
            const inquiries = await Inquiry.find();
            res.json(inquiries);
        }else{
            res.status(403).json({
                "message":"Please login with authorized account"
            });
        }
    }catch (err){
        //respond with a failure message in case of an error
        res.status(500).json({
            "message":"Failed to get inquiries",
            "error":err.message
        });
    }
}

//function to update an inquiry
export const updateInquiry = async (req,res)=>{
    try{
        if(checkIsAdmin(req)){
            //allow admins to update any inquiry by id
            const inquiryId = req.params.id;
            const data = req.body;

            //find the corresponding inquiry
            const inquiry = await Inquiry.findOne({id:inquiryId});

            if(inquiry == null){
                res.status(404).json({
                    "message":"No inquiry found for the ID"
                });
                return;
            }else{
                //update the inquiry
                await Inquiry.updateOne({id:inquiryId},data);
                res.json({
                    "message":"Inquiry updated successfully"
                });
                return;
            }
        }else if(checkIsCustomer(req)){
            //Allow customers to update only the message field of their own
            const inquiryId = req.params.id;
            const data = req.body;

            //find the inquiry by Id
            const inquiry = await Inquiry.findOne({id:inquiryId});

            if(inquiry == null){
                res.status(404).json({
                    "message":"No inquiry found for the ID"
                });
                return;
            }else{
                //check if the inquiry belongs to the customer
                if(inquiry.email === req.user.email){
                    await Inquiry.updateOne({id:inquiryId},{message:data.message});
                    res.json({
                        "message":"Inquiry updated successfully"
                    });
                    return;
                }else{
                    res.status(403).json({
                        "message":"You are not authorized to update this inquiry"
                    });
                    return;
                }
            }
        }else{
            res.status(403).json({
                "message":"Please login with a valid account"
            });
            return;
        }
    }catch (err){
        res.status(500).json({
            "message":"Error in updating inquiry",
            "error":err.message
        });
    }
}

export const deleteInquiry = async (req,res)=>{
    try{
        if(checkIsAdmin(req)){
            const inquiryId =req.params.id;

            await Inquiry.deleteOne({id:inquiryId});
            res.json({
                "message":"Inquiry deleted successfully"
            });
            return;
        }else if(checkIsCustomer(req)){
            const inquiryId =req.params.id;

            const inquiry = await Inquiry.findOne({id:inquiryId});
            if(inquiry == null){
                res.status(404).json({
                    "message":"No inquiry found for the ID"
                });
                return;
            }else{
                if(inquiry.email === req.user.email){
                    await Inquiry.deleteOne({id:inquiryId});
                    res.json({
                        "message":"Inquiry deleted successfully"
                    });
                    return;
                }else{
                    res.status(403).json({
                        "message":"Please login with a valid account"
                    });
                    return;
                }
            }
        }else{
            res.status(403).json({
                "message":"You are not authorized to perform this action"
            });
            return;
        }
    }catch(err){
        res.status(500).json({
            "message":"Error in deleting inquiry"
        });
    }
}