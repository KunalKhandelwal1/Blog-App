import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;
function createTokenForUser(user) {
  // this will return token
  const token = jwt.sign(
    {
      _id: user._id,
      email: user.email,
      profileImage: user.profileImage,
      role: user.role,
      name:user.name,
    },
    SECRET_KEY,
    { expiresIn: "4h" }
  );
  return token;
}

function validateToken(token){
   const payload = jwt.verify(token, SECRET_KEY);
   return payload;
}
export {validateToken , createTokenForUser};
