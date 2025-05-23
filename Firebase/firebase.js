// firebase.js
import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceKey = require("../FcmKey/serverkey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    // Optionally include your database URL if needed:
    // databaseURL: "https://<YOUR_PROJECT_ID>.firebaseio.com"
  });
}

export default admin;
