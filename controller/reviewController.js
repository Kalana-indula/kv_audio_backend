import Review from "../models/review.js";

const addReview = async (req,res)=>{
    try{
        //check if the user logged in
        if(req.user == null){
            res.status(403).json({
                "message":"Please log in to review"
            });
            return;
        }

        //get user data
        const data = req.body;

        //get the name details from the request
        const name = req.user.firstName+" "+req.user.lastName;

        //get the email
        const email = req.user.email;

        //get profile pic
        const profilePicture = req.user.profilePicture;

        //create a new 'Review' object
        const newReview = new Review(data);

        //save review
        const review= await newReview.save();

        res.status(200).json({
            "message":"Review published successfully",
            "review":review
        });
    }catch (err){
        res.status(500).json({
            "message":"Error in updating publishing review",
            "error":err.message
        });
    }
}