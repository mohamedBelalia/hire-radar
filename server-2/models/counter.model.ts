import mongoose, { Document, Schema, models } from "mongoose";

interface CounterI extends Document {
  _id: string;       // name of the collection (e.g., "Message", "Conversation")
  seq: number;
}

const counterSchema = new Schema<CounterI>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = models.Counter || mongoose.model<CounterI>("Counter", counterSchema);

export default Counter;
