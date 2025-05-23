import Notification from "../model/notification.js";
import ReadNotification from "../model/readnotification.js";
import admin from "../../Firebase/firebase.js";
import { v4 as uuidv4 } from "uuid";

export const getNotifications = async (req, res) => {
  const { cid } = req.query;
  if (!cid)
    return res
      .status(400)
      .json({ StatusCode: 400, Message: "CID is required." });

  try {
    const notifications = await Notification.find()
      .sort({ date: -1 })
      .limit(20);
    const totalCount = await Notification.countDocuments();

    const response = notifications.map((n) => ({
      ...n._doc,
      ActiveStatus: n.isExpired,
      isExpired: undefined,
    }));

    return res.status(200).json({
      StatusCode: 200,
      NotificationData: response,
      TotalCount: totalCount,
    });
  } catch (err) {
    return res.status(500).json({
      StatusCode: 500,
      Message: "Internal server error",
      error: err.message,
    });
  }
};

export const addNotification = async (req, res) => {
  try {
    const { title, message, activeStatus, apkUrl, entryBy } = req.body;
    const istTime = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    if (!title || title.length > 200 || !message || message.length > 3000) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid title or message length." });
    }

    const notificationGuid = uuidv4();

    const newNotification = new Notification({
      title,
      message,
      date: istTime,
      isExpired: activeStatus,
      entryBy,
      apkUrl,
      notificationGuid,
    });

    const saved = await newNotification.save();

    const messagePayload = {
      topic: "all",
      notification: { title, body: message },
      data: { notificationGuid, apkUrl: apkUrl || "" },
      android: { priority: "high", ttl: 60 * 60 * 24 * 1000 },
    };

    if (JSON.stringify(messagePayload).length > 4000) {
      return res
        .status(400)
        .json({ success: false, message: "Payload too large." });
    }

    try {
      const responseMessageId = await admin.messaging().send(messagePayload);
      console.log("Push sent with ID:", responseMessageId);
    } catch (firebaseError) {
      return res.status(500).json({
        success: false,
        message: "Firebase push failed",
        error: firebaseError.message,
      });
    }

    return res
      .status(201)
      .json({ success: true, message: "Saved and sent.", data: saved });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error adding notification",
      error: error.message,
    });
  }
};

export const markAsRead = async (req, res) => {
  const { notificationGuid, userId } = req.body;
  if (!notificationGuid || !userId)
    return res.status(400).json({
      success: false,
      message: "Notification ID and User ID are required.",
    });

  try {
    const existing = await ReadNotification.findOne({
      notificationGuid,
      staffId: userId,
    });
    if (!existing) {
      await ReadNotification.create({ notificationGuid, staffId: userId });
    }
    res
      .status(200)
      .json({ success: true, message: "Notification marked as read." });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getReadNotifications = async (req, res) => {
  const { userId } = req.query;
  if (!userId)
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });

  try {
    const read = await ReadNotification.find({
      staffId: userId,
      readStatus: true,
    }).select("notificationGuid");
    res.status(200).json({ success: true, data: read });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
