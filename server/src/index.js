const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("express-async-errors");

const { port, clientUrl } = require("./config/env");
const { requireAuth } = require("./middleware/auth");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const approvalRoutes = require("./routes/approvalRoutes");
const ruleRoutes = require("./routes/ruleRoutes");

const app = express();

app.use(cors({ origin: clientUrl, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", requireAuth, userRoutes);
app.use("/api/expenses", requireAuth, expenseRoutes);
app.use("/api/approvals", requireAuth, approvalRoutes);
app.use("/api/rules", requireAuth, ruleRoutes);

const clientDistPath = path.resolve(__dirname, "../../client/dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get(/^\/(?!api|uploads).*/, (_req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ message: error.message || "Internal server error." });
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
});
