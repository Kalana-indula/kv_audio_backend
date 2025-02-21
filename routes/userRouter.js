import express from 'express';
import {deleteUser, findAllUsers, findUserById, registerUser, updateUser} from "../controller/userController.js";

//creating a user object
const userRouter=express.Router();

//call 'regusterUser' to save a new user
userRouter.post("/",registerUser);
userRouter.get("/",findAllUsers);
userRouter.get("/:userId",findUserById);
userRouter.put("/:userId",updateUser);
userRouter.delete("/:userId",deleteUser);

export default userRouter;
