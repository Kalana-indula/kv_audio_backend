import mongoose from 'mongoose';

const itemSchema=new mongoose.Schema({
    itemId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String,
        required:true,
        default:"Uncategorized"
    },
    dimensions:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    availability:{
        type:Boolean,
        required:true,
        default:false
    },
    stock:{
        type:Number
    },
    image:{
        type:[String],
        required:true,
        default:["location_link"]
    }
});

//assuring 'availability' is set to false if stock=0
itemSchema.pre('save', function(next) {
    // Use 'this' to refer to the document being saved
    if (this.stock > 0) {
        this.availability = true;
    } else {
        this.availability = false;
    }
    next();
});


//creating the item model
const Item=mongoose.model("Item",itemSchema);

export default Item;