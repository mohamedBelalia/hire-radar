import mongoose, { Document, Schema, models } from "mongoose";
import Counter from "./counter.model";

export interface ConversationI extends Document {
  _id: number;
  participants: number[]; // array of user IDs as int
  lastMessage: number; // message ID as int
}

const conversationSchema = new Schema<ConversationI>({
  _id: { type: Number },
  participants: [{ type: Number, required: true }],
  lastMessage: { type: Number, required: true },
}, { timestamps: true });

conversationSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "Conversation",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc._id = counter.seq;
  }
  next();
});

const Conversation = models.Conversation || mongoose.model<ConversationI>("Conversation", conversationSchema);
export default Conversation;
