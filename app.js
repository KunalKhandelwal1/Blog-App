import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import staticRoute from "./routers/staticRouter.js";
import Router from "./routers/user.js";
import Blog from "./models/blog.js";
import path from "path";
import blogRouter from "./routers/blog.js";
import { connection } from "./connection.js";
import cookieParser from "cookie-parser";
import { checkForAuthencticationCookie } from "./middlewares/authentication.js";

const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(cookieParser());
app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

// ✅ Wrap everything in an async IIFE
(async () => {
  await connection(); // connect to DB first

  // ✅ Setup authentication middleware
  app.use(checkForAuthencticationCookie("token"));

  // ✅ Routes
  app.get("/", async (req, res) => {
    try {
      const allBlog = await Blog.find({}).sort({ createdAt: -1 });
      res.render("home", {
        user: req.user,
        blogs: allBlog,
      });
    } catch (err) {
      console.error("❌ Error fetching blogs:", err.message);
      res.status(500).send("Internal Server Error");
    }
  });

  app.use("/", staticRoute);
  app.use("/user", Router);
  app.use("/blog", blogRouter);

  // ✅ Start server
  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();
