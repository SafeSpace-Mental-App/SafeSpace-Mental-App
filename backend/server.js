const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("✅ SafeSpace backend is running!");
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
