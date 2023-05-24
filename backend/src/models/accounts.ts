import mongoose from "mongoose";

// Mongoose Schema für einen Account
const AccountSchema = new mongoose.Schema({
  email: { type: String, trim: true, unique: true, sparse: true },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: false,
  },
  password: { type: String, trim: true },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

export const Account = mongoose.model("Account", AccountSchema);
