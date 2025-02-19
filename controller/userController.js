import User from "../models/user.js";

//saving a user
export const registerUser=(req,res)=>{

    const data=req.body;

    //create a new user object
    const newUser=new User(data);

    newUser.save().then(()=>{
        res.json({
            "message":"User saved successfully"
        });
    }).catch((error)=>{
        res.status(500).json({
            "error":error.message
        });
        console.log(error.message);
    });
}

//get all students
export const findAllUsers=(req,res)=>{

    User.find().then((result)=>{
        res.json(result);
    }).catch((error)=>{
        res.status(500).json({
            "error":"Failed to find products"
        });
    });
}

//
export const findUserById=(req,res)=>{

}