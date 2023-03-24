import jwt from "jsonwebtoken";

import User from "../models/user.js";

/**
 * @description Middleware to authenticate the user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {json} error message if user is not authenticated
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get the JWT token from the request header
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the JWT token
    const user = await User.findById(decoded.userId, { password: 0 }).populate(
      "subscription"
    );
    console.log(user);

    // Add the user object to the request object
    req.user = user;

    // Call the next middleware
    next();
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

export default authMiddleware;
