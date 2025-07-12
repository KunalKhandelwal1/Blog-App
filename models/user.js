import mongoose from "mongoose";
import { createHmac, randomBytes } from "node:crypto";
import {createTokenForUser } from  "../services/auth.js";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    profileImage: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  // do stuff
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.password = hashedPassword;
  this.salt = salt;
  next();
});
userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("user not found");
  const salt = user.salt;
  const hashedPassword = user.password;
  const userProvidedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");
  if (hashedPassword != userProvidedPassword)
    throw new Error("incorrect password");
  const token  = createTokenForUser(user);
  return token;
});
const User = new mongoose.model("user", userSchema);
export default User;
