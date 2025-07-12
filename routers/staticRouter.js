import express from "express";
const router = express.Router();
router.get("/signup",(req,res)=>{
    res.render("signup");
})
router.get("/login",(req,res)=>{
    res.render("login");
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token").redirect("/");
})
router.get("/blog/add-blog",(req,res)=>{
    res.render("addBlog",{
        user:req.user,
    });
})
export default router;