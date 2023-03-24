import Request from "../models/request.js";

const rateLimitMiddleware = async (req, res, next) => {
  try {
    const user = req.user;
    const subscriptionPlan = user.subscription;

    // Check if the user's subscription plan has a maximum number of requests
    if (subscriptionPlan.maxRequests) {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Get the number of requests the user has made in the current billing cycle
      const numRequestsMonth = await Request.countDocuments({
        userId: user._id,
        subscriptionPlanId: subscriptionPlan._id,
        timestamp: { $gte: startOfMonth },
      });
      const numRequestsDay = await Request.countDocuments({
        userId: user._id,
        subscriptionPlanId: subscriptionPlan._id,
        timestamp: { $gte: today.setHours(0, 0, 0, 0) },
      });

      // Check if the user has exceeded their maximum number of requests for the month
      if (numRequestsMonth >= subscriptionPlan.maxRequestsPerMonth) {
        return res.status(429).json({
          error:
            "You have exceeded your maximum number of requests for this billing cycle. Please upgrade your subscription plan or try again later.",
        });
      }

      // Check if the user has exceeded their maximum number of requests for the day
      if (numRequestsDay >= subscriptionPlan.maxRequestsPerDay) {
        return res.status(429).json({
          error:
            "You have exceeded your maximum number of requests for today. Please try again later.",
        });
      }

      // Create a new request object and save it to the database
      const request = new Request({
        userId: user._id,
        subscriptionPlanId: subscriptionPlan._id,
        timestamp: new Date(),
        ip: req.ip,
      });
      await request.save();
    }

    // Call the next middleware
    next();
  } catch (error) {
    // Handle any errors that occur
    console.error(error);
    res.status(500).json({
      error: "An error occurred while processing your request.",
    });
  }
};

// Export the rate limiting middleware
export default rateLimitMiddleware;
