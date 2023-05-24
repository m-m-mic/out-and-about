import mongoose from "mongoose";

// Mongoose Schema für eine Aktivität
const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  items: {
    type: [String],
    required: false,
  },
  organizers: {
    type: [
      {
        _id: String,
        first_name: String,
        last_name: String,
        email: String,
        show_email: Boolean,
        phone_number: String,
        show_phone_number: Boolean,
      },
    ],
    required: true,
  },
  only_logged_in: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
});

export const Activity = mongoose.model("Activity", ActivitySchema);
