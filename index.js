import express from 'express';  //import express
import bodyParser from 'body-parser'; //importing body parser
import mongoose from 'mongoose'; //import mongoose
import userRouter from "./routes/userRouter.js";
import Counter from "./models/counter.js";
import itemRouter from "./routes/itemRouter.js";
import jwt from 'jsonwebtoken'; //import jsonwebtoken
import dotenv from "dotenv";
import inquiryRouter from "./routes/inquiryRouter.js"; //import dotenv

//configure '.env' file
dotenv.config();

//create an object of 'express'
let app=express();

//Implement 'body-parser'
app.use(bodyParser.json());

//middleware to log all incoming requests
app.use((req,res,next)=>{
    let token=req.header("Authorization");

    //check if token exists and remove 'Bearer' prefix if so
    if(token!=null){
        token=token.replace("Bearer ","");

        // console.log(token);
        //verify the token using the secret key provided
        jwt.verify(token,process.env.JWT_SECRET,(error,decoded) => {
            if(!error){
                //create a new key - 'user' and assign decoded value
                req.user=decoded;
            }
        });
    }
    //moving to next appropriate request
    next();
});

//set up the mongoDB connection URL
let mongoUrl=process.env.MONGO_URL;

//connect to the mongoDB cluster
mongoose.connect(mongoUrl);

//accessing the mongoDB connection
let mongoConnection=mongoose.connection;

//Listen for the open event
mongoConnection.once('open',()=>{
    console.log("Connection was established successfully.");
});

//create a method to listen to the port
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});

//initialize counter
const initializeCounter= async ()=> {
    try {
        // Use findByIdAndUpdate with upsert: true to avoid duplicates
        await Counter.findByIdAndUpdate(
            { _id: 'userId' },
            { $inc: { sequence_value: 0 } },  // Ensure sequence starts from 0
            { new: true, upsert: true }  // If not found, create the document
        );
        console.log('Counter initialized or updated');
    } catch (err) {
        console.error('Error initializing counter:', err);
    }
}

initializeCounter();

//send api requests to the through routes
app.use("/api/users",userRouter);
app.use("/api/items",itemRouter);
app.use("/api/inquiries",inquiryRouter);


