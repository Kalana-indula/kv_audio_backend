//import express
import express from 'express';

//importing body parser
import bodyParser from 'body-parser';

//import mongoose
import mongoose from 'mongoose';
import userRouter from "./routes/userRouter.js";
import Counter from "./models/counter.js";

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


