import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

//configure env file
dotenv.config();

//saving a user
export const registerUser = async (req, res) => {
    try {
        //fetch data from request body
        const data = req.body;

        //encrypt password in request body
        data.password = bcrypt.hashSync(data.password, 10);

        //create a new user object
        const newUser = new User(data);

        await newUser.save();

        res.json(data);
    } catch (err) {
        res.status(500).json({
            "message": "Error adding user",
            "error": err.message
        });
        console.log(err);
    }
}

//login with password validation
export const loginUser = async (req, res) => {
    try {
        //fetch data from request body
        const data = req.body;

        //find existing user
        const user = await User.findOne({email: data.email});

        if (!user) {
            res.status(404).json({
                "message": "User not found"
            });

        } else {
            //compare provided password and user password
            const isPasswordCorrect = bcrypt.compareSync(data.password, user.password);

            if (isPasswordCorrect) {
                //generate jwt token
                const token = jwt.sign({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    phone:user.phone
                }, process.env.JWT_SECRET);
                //send token with jwt response
                res.json({
                    "message": "User logged in",
                    token: token
                });
            } else {
                res.status(401).json({
                    "message": "Login failed, invalid password"
                });
            }
        }
    } catch (err) {
        res.status(500).json({
            "error": err.message
        });
    }
}

//get all students
export const findAllUsers = async (req, res) => {
    try {
        if (checkIsAdmin(req)) {
            //find all available users
            const users = await User.find();

            //send respond with fetched details
            res.json(users);
        }else{
            res.status(403).json({
                "message":"You are unauthorized to perform this action"
            });
        }
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
export const updateUser = async (req, res) => {
    try {
        //fetch user Id from request parameters
        const userId = req.params.userId;

        //get updated product data from request body
        const userData = req.body;

        //update the user corresponding to the id
        const updatedUser = await User.updateOne({userId: userId}, userData);

        //send the respond
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            "error": error.message
        });
    }
}

//delete an existing user
export const deleteUser = async (req, res) => {
    try {
        //fetch the userId from request parameters
        const userId = req.params.userId;

        //delete user corresponding to the id
        await User.deleteOne({userId: userId});

        res.json({
            "message": "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            "error": error.message
        });
    }
}

//check if a user is an admin
export const checkIsAdmin = (req) => {
    let isAdmin = false;

    if (req.user != null) {
        if (req.user.role === "admin") {
            isAdmin = true;
        }
    }
    return isAdmin;
}

//check if a user is a customer
export const checkIsCustomer = (req) => {
    let isCustomer = false;

    if (req.user != null) {
        if (req.user.role === "customer") {
            isCustomer = true;
        }
    }

    return isCustomer;
}

/* customer user
    "email": "indula12@example.com",
    "password": "12345"
 */

