import mongoose from "mongoose";

// Mongoose Schema für eine Aktivität
const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [{ type: String, ref: "Category" }],
  date: { type: Number, required: true },
  active: { type: Boolean, default: true },
  information_text: { type: String, trim: true },
  /* TODO: GeoJSON muss hier hin, type: String ist nur placeholder */
  location: { type: String },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  maximum_participants: Number,
  only_logged_in: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
});

export const Activity = mongoose.model("Activity", ActivitySchema);
