import express from 'express';
import {
    deleteUser,
    findAllUsers,
    findUserById,
    loginUser,
    registerUser,
    updateUser
} from "../controller/userController.js";

//creating a user object
const userRouter=express.Router();

//call 'registerUser' to save a new user
userRouter.post("/",registerUser);
userRouter.get("/",findAllUsers);
userRouter.get("/:userId",findUserById);
userRouter.put("/:userId",updateUser);
userRouter.delete("/:userId",deleteUser);
userRouter.post("/login",loginUser);

export default userRouter;
