// Import the mongoose library for interacting with MongoDB
import mongoose from 'mongoose';

// Define a schema for the 'Counter' collection that will store sequence values
const counterSchema = new mongoose.Schema({

    // _id field will uniquely identify this counter document (e.g., 'userId', 'orderId')
    _id: {
        type: String,    // _id is a string (e.g., 'userId', 'orderId', etc.)
        required: true   // _id is required for each counter document
    },

    // sequence_value field stores the current number of the counter (e.g., last userId)
    sequence_value: {
        type: Number,    // This field stores the sequence number
        default: 0       // Default value is 0 (first increment will be 1)
    }
});

// Create a Mongoose model 'Counter' based on the schema
const Counter = mongoose.model('Counter', counterSchema);

// Export the 'Counter' model for use in other parts of the application
export default Counter;
