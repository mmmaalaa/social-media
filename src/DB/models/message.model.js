import { model, Schema, Types } from "mongoose";

const messageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      minLength: [1, "Message content must be at least 1 character"],
      maxLength: [500, "Message content must be at most 500 characters"],
    },
    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const messageModel = model("Message", messageSchema);
export default messageModel;