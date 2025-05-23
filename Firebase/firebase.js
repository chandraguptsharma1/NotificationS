// firebase.js
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

// Ensure environment variable is loaded
if (!process.env.FIREBASE_SERVICE_KEY) {
  console.error("❌ FIREBASE_SERVICE_KEY is undefined. Check your .env file.");
  process.exit(1);
}

// Parse the JSON string from the .env
const serviceKey = JSON.parse(process.env.FIREBASE_SERVICE_KEY);

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
  });
}

export default admin;
