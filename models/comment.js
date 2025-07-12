import mongoose from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import { createTokenForUser } from "../services/auth.js";
import { type } from "node:os";
const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      require: true,
    },
    blogId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"blog",      
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);


const Comment = new mongoose.model("comment", commentSchema);
export default Comment;
