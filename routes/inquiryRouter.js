import express from 'express';
import {addInquiry} from "../controller/inquiryController.js";

const inquiryRouter= express.Router();

inquiryRouter.post("/",addInquiry);

export default inquiryRouter;