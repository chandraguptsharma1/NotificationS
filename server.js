import express from "express";
import os from "os";
import fs from "fs";
import https from "https";
import connectDB from "./Notification_Api/connection/dbConfig.js"; // Import the database connection
import notificationRoutes from "./Notification_Api/routers/saveNotificationRouter.js";

const app = express();
const PORT = process.env.PORT || 443;

// Middleware
app.use(express.json());

await connectDB();

app.use("/api/notifications", notificationRoutes);

// ✅ SSL certificate paths (replace with your actual path)
const sslOptions = {
  key: fs.readFileSync("./SSlDocument/wildcard_cashportech_org.key"), // private key
  // cert: fs.readFileSync("./SSlDocument/wildcard_cashportech_org.crt"), // certificate
  cert: fs.readFileSync("./SSlDocument/fullchain.pem"),

  // ca: fs.readFileSync("/etc/ssl/certs/yourdomain_ca_bundle.crt") // optional CA bundle
};

// Test database connection before starting the server

// Test API Route
app.get("/", async (req, res) => {
  try {
    const pool = await connectDB();
    res.send("✅ Server is running and connected to DB");
  } catch (error) {
    res.status(500).send("❌ Database Connection Failed");
  }
});

// ✅ Create HTTPS server
// ✅ Create HTTPS server ONLY (no HTTP fallback)
// ✅ Create HTTPS server
// https.createServer(sslOptions, app).listen(PORT, "0.0.0.0", () => {
//   const networkInterfaces = os.networkInterfaces();
//   const localIP = Object.values(networkInterfaces)
//     .flat()
//     .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

//   console.log(`🚀 Secure HTTPS server is running:
//   👉 On Network: https://${localIP}
//   👉 Domain:     https://sugamn.cashportech.org`);
// });

// // Start the server
app.listen(PORT, "0.0.0.0", () => {
  const networkInterfaces = os.networkInterfaces();
  const localIP = Object.values(networkInterfaces)
    .flat()
    .find((iface) => iface.family === "IPv4" && !iface.internal)?.address;

  console.log(`🚀 Server running at:
  👉 Local:     http://localhost:${PORT}
  👉 On Network: http://${localIP}:${PORT}`);
});
