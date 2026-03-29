const express = require("express");
const { z } = require("zod");
const { createRule, listRules } = require("../controllers/ruleController");
const { requireRole } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

router.get("/", requireRole("ADMIN", "MANAGER"), listRules);

router.post(
  "/",
  requireRole("ADMIN"),
  validateBody(
    z.object({
      ruleType: z.enum(["SEQUENTIAL", "CONDITIONAL", "HYBRID", "PARALLEL"]),
      percentageRequired: z.coerce.number().min(0).max(1).optional().nullable(),
      specificApproverRole: z.enum(["ADMIN", "MANAGER", "EMPLOYEE"]).optional().nullable(),
      minAmount: z.coerce.number().optional().nullable(),
      maxAmount: z.coerce.number().optional().nullable(),
    })
  ),
  createRule
);

module.exports = router;
