const express = require("express");
const path = require("path");
const cvRoutes = require("./route/cvRoutes");

const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

// Use the cv routes
app.use("/cv", cvRoutes);

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
