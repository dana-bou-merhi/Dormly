import {Message} from "../models/messages.model.js";


export const sendMessage = async (req, res) => {
  try {
    const { propertyId, landlordId, content } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    if (req.user._id.toString() === landlordId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot message yourself'
      });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver: landlordId,
      propertyId,
      content
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully', 
      data: newMessage                      
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
};

// new added 

export const replyToMessage = async (req, res) => {
  try {
    const { messageId, content } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated"
      });
    }

    const originalMessage = await Message.findById(messageId);

    if (!originalMessage) {
      return res.status(404).json({
        success: false,
        message: "Message not found"
      });
    }

    // Only receiver (landlord) can reply
    if (originalMessage.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reply"
      });
    }

    // Create reply (reverse sender/receiver)
    const replyMessage = await Message.create({
      sender: req.user._id,
      receiver: originalMessage.sender,
      propertyId: originalMessage.propertyId,
      content,
      status: "replied"
    });

    // Update original message status
    originalMessage.status = "replied";
    await originalMessage.save();

    return res.status(201).json({
      success: true,
      message: "Reply sent successfully",
      data: replyMessage
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send reply"
    });
  }
};


export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .sort({ createdAt: -1 })
      .populate("propertyId", "title location images")
      .populate("sender", "username ")
      .populate("receiver", "username ");

    const conversationsMap = new Map();

    for (let msg of messages) {
      const isSender = msg.sender._id.toString() === userId.toString();

      const otherUser = isSender ? msg.receiver : msg.sender;

      const key = `${msg.propertyId._id}_${otherUser._id}`;

      if (!conversationsMap.has(key)) {
        conversationsMap.set(key, {
          id: msg._id ,//key,

          user: {
            _id: otherUser._id,
            username: otherUser.username,
           // profilePicture: otherUser.profilePicture
          },

          property: {
            _id: msg.propertyId._id,
            title: msg.propertyId.title,
            location: msg.propertyId.location,
            image: msg.propertyId.images?.[0]
          },

          
          lastMessage: msg.content,
          sentAt: msg.createdAt,
        status: msg.status || "pending",
         isMine: isSender 
        });
      }
    }

    const conversations = Array.from(conversationsMap.values());

    res.status(200).json({
      success: true,
      conversations
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations"
    });
  }
};