import SubscriptionPlan from '../models/subscriptionPlan.js'

export default async function checkSubscriptionLimit(req, res, next) {
  try {
    const userSubscription = await SubscriptionPlan.findById(
      req.user.subscription,
    )
    if (!userSubscription) {
      return res
        .status(400)
        .json({ message: 'User subscription plan not found' })
    }

    const maxRequestsPerMonth = userSubscription.maxRequestsPerMonth
    const subscriptionStartDate = req.user.subscriptionStartDate
    const requestsThisMonth = await req.db.Request.countDocuments({
      user: req.user._id,
      createdAt: {
        $gte: subscriptionStartDate,
        $lte: new Date(),
      },
    })

    if (requestsThisMonth >= maxRequestsPerMonth) {
      return res.status(429).json({ message: 'Subscription limit exceeded' })
    }

    next()
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Server error' })
  }
}
