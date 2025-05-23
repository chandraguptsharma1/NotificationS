// models/Notification.js
import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
  message: { type: String, required: true, maxlength: 3000 },
  date: { type: Date, default: Date.now },
  isExpired: { type: Boolean, default: false },
  apkUrl: { type: String },
  entryBy: { type: String },
  notificationGuid: { type: String, required: true, unique: true },
});

export default mongoose.model("Notification", NotificationSchema);
