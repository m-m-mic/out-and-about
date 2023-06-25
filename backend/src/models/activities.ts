import mongoose from "mongoose";

//Schema für Geolocation
const GeoSchema = new mongoose.Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
  },
});

// Mongoose Schema für eine Aktivität
const ActivitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categories: [{ type: String, ref: "Category" }],
  date: { type: Number, required: true },
  information_text: { type: String, trim: true },
  location: GeoSchema,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
  maximum_participants: { type: Number, required: true },
  only_logged_in: { type: Boolean, default: false },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "Account" }],
  distance: { type: Number, optional: true },
});

ActivitySchema.index({ location: "2dsphere" });

export const Activity = mongoose.model("Activity", ActivitySchema);
