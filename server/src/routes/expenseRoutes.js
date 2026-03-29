const express = require("express");
const { z } = require("zod");
const { createExpense, listExpenses, getExpenseById, getDashboard, extractReceipt } = require("../controllers/expenseController");
const upload = require("../middleware/upload");
const { validateBody } = require("../middleware/validate");

const router = express.Router();

router.get("/", listExpenses);
router.get("/dashboard", getDashboard);
router.get("/:id", getExpenseById);
router.post("/ocr", upload.single("receipt"), extractReceipt);
router.post(
  "/",
  upload.single("receipt"),
  validateBody(
    z.object({
      amount: z.coerce.number().positive(),
      currency: z.string().trim().length(3),
      category: z.string().trim().min(1),
      description: z.string().trim().min(1),
      date: z.string().trim().min(1),
    })
  ),
  createExpense
);

module.exports = router;
