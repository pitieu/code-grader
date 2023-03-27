import jwt from 'jsonwebtoken'

import User from '../models/user.js'

/**
 * Middleware to authenticate the user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - The error message if user is not authenticated.
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1]

    // Check if the token is present in the request header
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized. User not found.' })
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Find the user associated with the JWT token
    const user = await User.findById(decoded.userId, {
      password: 0,
      apiKeys: 0,
      __v: 0,
    }).populate('subscription', { __v: 0 })

    // Add the user object to the request object
    req.user = user

    // Call the next middleware function
    next()
  } catch (error) {
    // Handle any errors that occur during authentication
    console.error(error)
    res.status(401).json({ error: 'Unauthorized. Authentication failed.' })
  }
}

export default authMiddleware
