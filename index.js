//import express
import express from 'express';

//importing body parser
import bodyParser from 'body-parser';

//import mongoose
import mongoose from 'mongoose';
import userRouter from "./routes/userRouter.js";

//create an object of 'express'
let app=express();

//Implement 'body-parser'
app.use(bodyParser.json());

//set up the mongoDB connection URL
let mongoUrl="mongodb+srv://root:root@cluster0.6avps.mongodb.net/kv?retryWrites=true&w=majority&appName=Cluster0";

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

// Test requests
app.get("/",(req,res)=>{
    console.log("This is a test get request");
    res.json({
        "messsage":"Hello World"
    });
});

//send api requests to the through routes
app.use("/api/users",userRouter);


