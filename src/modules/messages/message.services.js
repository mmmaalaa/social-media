import messageModel from "../../DB/models/message.model.js";
import userModel from "../../DB/models/user.model.js";
import { AppError } from "../../utils/appError.js";

export const sendMessage = async (req, res, next) => {
  const { content, receiver } = req.body;
  const receiverExist = await userModel.findById(receiver);
  if (!receiverExist) throw new AppError("receiver not found", 404);
  const sender = req.user._id;
  const message = await messageModel.create({ sender, receiver, content });
  return res.status(201).json({
    success: true,
    message: `message sent successfully`,
    data: message,
  });
};

export const readMessage = async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModel
    .findById(id)
    .select("content _id receiver");
  if (!message) throw new AppError("message not found", 404);
  if (!message.receiver.equals(req.user._id))
    throw new AppError("you are not authorized to see this message", 403);
  return res.status(200).json({ status: "success", message });
};
export const readAllMessages = async (req, res, next) => {
  const messages = await messageModel
    .find({ receiver: req.user._id })
    .select("content _id ");
  return res.status(200).json({ status: "success", data: messages });
};

export const deleteMessage = async (req, res, next) => {
  const { id } = req.params;
  const message = await messageModel.findById(id);
  if (!message) throw new AppError("message not found", 404);
  if (!message.receiver.equals(req.user._id))
    throw new AppError("you are not authorized to delete this message", 403);
  await messageModel.findByIdAndDelete(id);
  return res
    .status(204)
    .json({ data: null, message: "message deleted successfully" });
};
