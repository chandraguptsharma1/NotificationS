import express from "express";
import {
  addNotification,
  getNotifications,
  markAsRead,
  getReadNotifications,
} from "../Controllers/SaveNotification.js";

const router = express.Router();

// Route to create a new notification
router.post("/save_notification", addNotification);

// Route to get all notifications
router.get("/getAllNotification", getNotifications);
router.post("/markAsRead", markAsRead);
router.post("/getReadNotifications", getReadNotifications);

export default router;
