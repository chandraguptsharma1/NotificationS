// models/ReadNotification.js
import mongoose from "mongoose";

const ReadNotificationSchema = new mongoose.Schema({
  notificationGuid: { type: String, required: true },
  staffId: { type: String, required: true },
  readStatus: { type: Boolean, default: true },
  readDate: { type: Date, default: Date.now },
});

export default mongoose.model("ReadNotification", ReadNotificationSchema);
