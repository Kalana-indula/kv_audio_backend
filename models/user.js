//importing mongoose
import mongoose from 'mongoose';
import Counter from "./counter.js";  //Import the counter model

const userSchema=new mongoose.Schema({
    userId:{
        type:Number,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:"customer"
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        required:true,
        default:"location_link"
    }
});

//Pre-save hook to generate userId using the Counter model
userSchema.pre('save',async function(next){
    if(this.isNew){
        const counter=await Counter.findByIdAndUpdate(
            {_id:'userId'},
            {$inc:{sequence_value:1}},
            {new:true,upsert:true}
        );
        this.userId=counter.sequence_value;
        next();
    }
});

//create model named 'User' using the schema
const User=mongoose.model('User',userSchema);

export default User;