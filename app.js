import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import staticRoute from "./routers/staticRouter.js"
import Router from "./routers/user.js";
import Blog from "./models/blog.js";
import path from "path";
import blogRouter from "./routers/blog.js";
import {connection} from "./connection.js";
import cookieParser from "cookie-parser";
import { checkForAuthencticationCookie } from "./middlewares/authentication.js";
const app=express();
const port= process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set('view engine', 'ejs');
// connecting db
connection(process.env.MONGO_URL);
app.use(checkForAuthencticationCookie("token"));
app.get("/",async(req,res)=>{
const allBlog = await Blog.find({}).sort({ createdAt: -1 });
    res.render("home",{
        user:req.user,
        blogs:allBlog,
    })
})

app.use("/",staticRoute);
app.use("/user",Router);
app.use("/blog",blogRouter);

// app.listen(port,()=>{
//     console.log(`server is listening to the port ${port}`);
// })