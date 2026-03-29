const express = require("express");
const { z } = require("zod");
const { approveExpense, rejectExpense } = require("../controllers/approvalController");
const { requireRole } = require("../middleware/auth");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

const schema = z.object({
  expenseId: z.string().min(1),
  comments: z.string().optional().nullable(),
});

router.post("/approve", requireRole("ADMIN", "MANAGER"), validateBody(schema), approveExpense);
router.post("/reject", requireRole("ADMIN", "MANAGER"), validateBody(schema), rejectExpense);

module.exports = router;
