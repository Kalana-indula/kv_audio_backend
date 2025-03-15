import express from 'express';
import {addReview, approveReview, deleteReview, getReviews} from "../controller/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/",addReview);
reviewRouter.get("/",getReviews);
reviewRouter.put("/:email",approveReview);
reviewRouter.delete("/:email",deleteReview);

export default reviewRouter;
