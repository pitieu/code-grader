/**
 * @description: adminMiddleware checks if user is admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns {json} error message if user is not admin
 */
const adminMiddleware = async (req, res, next) => {
  try {
    // depends on the auth middleware to populate req.user
    const user = req.user

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (user.role !== 'admin') {
      return res
        .status(403)
        .json({ message: 'Access denied. Only admins can access this route.' })
    }

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server error.' })
  }
}

export default adminMiddleware
