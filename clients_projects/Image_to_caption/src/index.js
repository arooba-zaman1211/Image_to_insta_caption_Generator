require("dotenv").config();
const express = require("express");
const imageRoutes = require("../routes/imageroute/imageRoute");

const app = express();
app.use(express.json());

app.use("/api", imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
