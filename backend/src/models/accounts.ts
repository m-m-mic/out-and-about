import mongoose from "mongoose";
import { AccountType } from "../interfaces";

// Mongoose Schema für einen Account
const AccountSchema = new mongoose.Schema({
  email: { type: String, trim: true, unique: true, lowercase: true, sparse: true },
  username: {
    type: String,
    required: true,
  },
  categories: [{ type: String, ref: "Category" }],
  password: { type: String, trim: true },
  saved_activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  planned_activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

export const Account = mongoose.model<AccountType>("Account", AccountSchema);
