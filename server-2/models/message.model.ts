import mongoose, { Document, Schema, models } from "mongoose";
import Counter from "./counter.model";

export interface MessageI extends Document {
  _id: number; // integer ID
  sender: number; // your user ID as int
  conversation: number;
  text: string;
}

const messageSchema = new Schema<MessageI>({
  _id: { type: Number },
  sender: { type: Number, required: true },
  conversation: { type: Number, required: true },
  text: { type: String, required: true },
}, { timestamps: true });

// Pre-save hook to auto-increment _id
messageSchema.pre("save", async function (next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      "Message",
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    doc._id = counter.seq;
  }
  next();
});

const Message = models.Message || mongoose.model<MessageI>("Message", messageSchema);
export default Message;
