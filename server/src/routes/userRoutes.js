const express = require("express");
const { z } = require("zod");
const { createUser, listUsers } = require("../controllers/userController");
const { requireRole } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

router.get("/", requireRole("ADMIN", "MANAGER"), listUsers);

router.post(
  "/",
  requireRole("ADMIN"),
  validateBody(
    z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]),
      managerId: z.string().optional().nullable(),
    })
  ),
  createUser
);

module.exports = router;
