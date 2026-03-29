const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  exchangeRateApiKey: process.env.EXCHANGE_RATE_API_KEY || "",
};
