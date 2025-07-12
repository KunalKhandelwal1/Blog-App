import User from "../models/user.js";

async function signup(req, res) {
  const { name, email, password } = req.body;
  await User.create({
    name: name,
    email: email,
    password: password,
    // role: role,
  });
  res.redirect("/login");
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    console.log("token", token);
    res.cookie("token", token).redirect("/");
  } catch (error) {
    res.render("login", {
      error: "Incorrect Password or Email ",
    });
  }
}

export { signup, login };
