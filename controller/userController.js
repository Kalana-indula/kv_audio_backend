import User from "../models/user.js";

//saving a user
export const registerUser = (req, res) => {

    //fetch data from request body
    const data = req.body;

    //create a new user object
    const newUser = new User(data);

    newUser.save().then(() => {
        res.json({
            "message": "User saved successfully"
        });
    }).catch((error) => {
        res.status(500).json({
            "error": error.message
        });
        console.log(error.message);
    });
}

//get all students
export const findAllUsers = async (req, res) => {

    try {
        //find all available users
        const users = await User.find();

        //send respond with fetched details
        res.json(users);
    } catch (err) {
        res.status(500).json({
            "message": "Failed to find users",
            "error": err
        });
    }
}

//find a user by id
export const findUserById = async (req, res) => {
    try {
        //fetch user Id from request parameters
        const userId = req.params.userId;

        //find the user corresponding to the id
        const existingUser = await User.findOne({userId: userId});

        //send the response as a json
        res.json(existingUser);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

//update a user
export const updateUser=async (req,res)=>{
    try{
        //fetch user Id from request parameters
        const userId = req.params.userId;

        //get updated product data from request body
        const userData=req.body;

        //update the user corresponding to the id
        const updatedUser=await User.updateOne({userId: userId},userData);

        //send the respond
        res.json(updatedUser);
    }catch(error){
        res.status(500).json({
            "error": error.message
        });
    }
}

//delete an existing user
export const deleteUser=async (req,res)=>{
  try{
      //fetch the userId from request parameters
      const userId=req.params.userId;

      //delete user corresponding to the id
      await User.deleteOne({userId:userId});

      res.json({
          "message": "User deleted successfully"
      });
  }catch (error){
      res.status(500).json({
          "error": error.message
      });
  }
}


