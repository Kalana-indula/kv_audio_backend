import express from 'express';
import {findAllUsers, findUserById, registerUser} from "../controller/userController.js";

//creating a user object
const userRouter=express.Router();

//call 'regusterUser' to save a new user
userRouter.post("/",registerUser);
userRouter.get("/",findAllUsers);
userRouter.get("/:userId",findUserById);


export default userRouter;
