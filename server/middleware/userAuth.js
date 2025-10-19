import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Token:", decoded); 

    if (decoded.userId) {
      req.user = { userId: decoded.userId }; 
    } else if (decoded.id) {
      req.user = { userId: decoded.id };      // 👈 In case you used id instead of userId
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Not Authorized, Invalid Token" });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or Expired Token" });
  }
};

export default userAuth;
