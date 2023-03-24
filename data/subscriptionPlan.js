export default [
  {
    name: "Free",
    description: "Free plan",
    price: 0,
    maxRequestsPerDay: 100,
    maxRequestsPerMonth: 1000,
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Developer",
    description: "Developer plan",
    price: 29.9,
    maxRequestsPerDay: 1000,
    maxRequestsPerMonth: 10000,
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Team",
    description: "Team plan",
    price: 99.9,
    maxRequestsPerDay: 10000,
    maxRequestsPerMonth: 100000,
    isActive: true,
    createdAt: new Date(),
  },
  {
    name: "Custom",
    description: "Custom plan",
    price: 100000,
    maxRequestsPerDay: 100000000,
    maxRequestsPerMonth: 100000000,
    isActive: true,
    createdAt: new Date(),
  },
];