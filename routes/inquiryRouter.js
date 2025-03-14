import express from 'express';
import {addInquiry, deleteInquiry, getInquiries, updateInquiry} from "../controller/inquiryController.js";

const inquiryRouter= express.Router();

inquiryRouter.post("/",addInquiry);
inquiryRouter.get("/",getInquiries);
inquiryRouter.put("/:id",updateInquiry);
inquiryRouter.delete("/:id",deleteInquiry);

export default inquiryRouter;