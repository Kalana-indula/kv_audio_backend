import Review from "../models/review.js";
import {checkIsCustomer} from "./userController.js";

export const addReview = async (req, res) => {
    try {
        //check if the user logged in
        if (req.user == null) {
            res.status(403).json({
                "message": "Please log in to review"
            });
            return;
        }

        //get user data
        const data = req.body;

        //get the name details from the request
        data.name = req.user.firstName + " " + req.user.lastName;

        //get the email
        data.email = req.user.email;

        //get profile pic
        data.profilePicture = req.user.profilePicture;

        //create a new 'Review' object
        const newReview = new Review(data);

        //save review
        const review = await newReview.save();

        res.status(200).json({
            "message": "Review published successfully",
            "review": review
        });
    } catch (err) {
        res.status(500).json({
            "message": "Error in updating publishing review",
            "error": err.message
        });
    }
}

//get all reviews
export const getReviews = async (req, res) => {
    try {
        const user = req.user;

        if (user == null || checkIsCustomer(req)) {
            const reviews = await Review.find({isApproved: true});
            return res.status(200).json({
                "reviews": reviews
            });
        } else {
            const reviews = await Review.find();
            return res.status(200).json({
                "reviews": reviews
            });
        }
    } catch (err) {
        res.status(500).json({
            "message": "Failed to get reviews"
        });
    }
}

//update review
export const approveReview = async (req, res) => {
    try {
        const email = req.params.email;

        if (req.user == null) {
            res.status(403).json({
                "message": "Please log in and try again"
            });
            return;
        }

        if (req.user.role == "admin") {

            const existingReview = await Review.findOne({email: email});

            //check if review exists for the email
            if (!existingReview) {
                return res.status(404).json({
                    "message": "No review was found for this email"
                });
            }

            const review = await Review.updateOne(
                {email: email}, {isApproved: true}
            );
            return res.status(200).json({
                "message": "Review updated successfully",
                "review": review
            });
        } else {
            return res.status(403).json({
                "message": "Only admins are allowed to approve reviews"
            });
        }
    } catch (err) {
        res.status(500).json({
            "message": "Failed to update review",
            "error": err.message
        });
    }
}

//delete unnecessary reviews
export const deleteReview = async (req, res) => {
    try {
        const email = req.params.email;

        //check if the user logged in
        if (req.user == null) {
            return res.status(403).json({
                "message": "Please log in and try again"
            });
        }

        if (req.user.role == "admin") {

            const existingReview = await Review.findOne({email: email});

            if (!existingReview) {
                return res.status(404).json({
                    "message": "No review was found for this email"
                });
            } else {
                await Review.deleteOne({email: email});

                return res.status(200).json({
                    "message": "Review deleted successfully"
                });
            }
        } else {
            return res.status(403).json({
                "message": "Only admins are allowed to delete review"
            });
        }
    } catch (err) {
        res.status(500).json({
            "message": "Failed to delete review",
            "error": err.message
        });
    }
}