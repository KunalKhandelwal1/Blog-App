import express from "express";
const router = express.Router();
import Blog from "../models/blog.js";
import comment from "../models/comment.js";

import multer from "multer";
import path from "path";
// Configure Multer storage at the top
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.get("/add-blog", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});
router.post("/comment/:id",async(req,res)=>{
  await comment.create({
    content:req.body.content,
    blogId:req.params.id,
    createdBy:req.user._id,
  })
  return res.redirect(`/blog/${req.params.id}`);
})
router.post(
  "/add-blog",
  upload.single("imageURL"),
  async function (req, res, next) {
    console.log(req.body);
    console.log(req.file);
    const { title, body } = req.body;
    const blog = await Blog.create({
      title: title,
      body: body,
      createdBy: req.user._id,
      imageURL: `/uploads/${req.file.filename}`,
    });
    res.redirect(`/blog/${blog._id}`);
  }
);
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const entry = await Blog.findById(id).populate("createdBy");
  const comm=await comment.find({blogId:req.params.id}).populate("createdBy");
  console.log(comm);
  res.render("blog", { user: req.user, entry,comm });
});
export default router;
