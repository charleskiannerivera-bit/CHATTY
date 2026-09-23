import User from "../models/User.js";
import Message from "../models/message.model.js";
import { hasImageKitConfig, uploadChatMedia } from "../lib/imagekit.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export async function getUsersForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-clerkId");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error fetching users for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConversationsForSidebar(req, res) {
  try {
    const loggedInUserId = req.user._id;

    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", loggedInUserId] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $max: "$createdAt" },
        },
      },
      {
        $match: {
          _id: { $ne: loggedInUserId },
        },
      },
      {
        $sort: { lastMessage: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $replaceRoot: { newRoot: { $arrayElemAt: ["$user", 0] } },
      },
      {
        $project: {
          clerkId: 0,
        },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations for sidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in  getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverId } = req.params;

    const senderId = req.user._id;

    console.log("SEND MESSAGE");
    console.log("Sender:", senderId.toString());
    console.log("Receiver:", receiverId);
    console.log("Text:", text);

    let imageURL;
    let videoURL;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res.status(500).json({
          message: "ImageKit configuration is missing",
        });
      }

      const url = await uploadChatMedia(req.file);

      if (req.file.mimetype.startsWith("video/")) {
        videoURL = url;
      } else {
        imageURL = url;
      }
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
      video: videoURL,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);

    res.status(500).json({
      message: error.message || "Internal server error",
    });
  }
}
