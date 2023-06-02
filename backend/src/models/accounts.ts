import mongoose from "mongoose";

// Mongoose Schema für einen Account
const AccountSchema = new mongoose.Schema({
  email: { type: String, trim: true, unique: true, sparse: true },
  username: {
    type: String,
    required: true,
  },
  categories: [{ type: String, ref: "Category" }],
  password: { type: String, trim: true },
  saved_activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
  planned_activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

export const Account = mongoose.model("Account", AccountSchema);
