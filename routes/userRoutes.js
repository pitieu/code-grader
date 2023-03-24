import express from 'express'
import userController from '../controllers/userController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Working' })
})
router.get('/ping/auth', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Working authentication required' })
})

// auth
router.post('/register', userController.register)
router.post('/login', userController.login)

// api keys
router.get('/api-keys', authMiddleware, userController.getApiKeys)
router.post('/api-keys', authMiddleware, userController.createApiKey)
router.delete('/api-keys/:id', authMiddleware, userController.deleteApiKey)

// subscriptions
router.post('/subscribe', authMiddleware, userController.subscribe)

export default router
