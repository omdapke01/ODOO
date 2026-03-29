const express = require("express");
const { z } = require("zod");
const { signup, login } = require("../controllers/authController");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

router.post(
  "/signup",
  validateBody(
    z.object({
      companyName: z.string().min(2),
      baseCurrency: z.string().length(3),
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
    })
  ),
  signup
);

router.post(
  "/login",
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(8),
    })
  ),
  login
);

module.exports = router;
