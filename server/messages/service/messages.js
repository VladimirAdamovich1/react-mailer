const Message = require("../../models/message");
const jwt = require("jsonwebtoken");

const getReceivedMessages = async (req, res) => {
  const userEmail = req.headers.useremail;
  const messages = await Message.find().sort({ date: -1 });
  const filteredMessages = messages.filter(
    (message) => message.receiver === userEmail
  );
  const response = {
    success: true,
    filteredMessages,
  };
  return res.status(200).json(response);
};
const getSentMessages = async (req, res) => {
  const userEmail = req.headers.useremail;
  const messages = await Message.find().sort({ date: -1 });
  const filteredMessages = messages.filter(
    (message) => message.sender === userEmail
  );
  const response = {
    success: true,
    filteredMessages,
  };
  return res.status(200).json(response);
};

const addMessage = async (req, res) => {
  const date = new Date();
  const data = req.body.data;
  const title = data.title;
  const sender = data.sender;
  const content = data.content;
  const receiver = data.receiver;
  if (!jwt.verify(req.body.token, "admin4123"))
    return res.status(403).json({ success: false });

  try {
    await new Message({
      title,
      sender,
      receiver,
      content,
      date,
    }).save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const deleteMessage = async (req, res) => {
  const id = req.headers.id;
  const token = req.headers.token;
  if (!jwt.verify(token, "admin4123"))
    return res.status(403).json({ success: false });
  try {
    await Message.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
};

const readStatusHandler = async (req, res) => {
  const id = req.headers.id;
  const token = req.headers.token;
  const read = req.headers.read;
  if (!jwt.verify(token, "admin4123"))
    return res.status(403).json({ success: false });
  if (!read) {
    try {
      await Message.findOneAndUpdate(
        { _id: id },
        { $set: { read: true } },
        { useFindAndModify: false }
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  } else {
    try {
      await Message.findOneAndUpdate(
        { _id: id },
        { $set: { read: false } },
        { useFindAndModify: false }
      );
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ success: false });
    }
  }
};

module.exports = {
  getReceivedMessages,
  getSentMessages,
  addMessage,
  deleteMessage,
  readStatusHandler,
};
