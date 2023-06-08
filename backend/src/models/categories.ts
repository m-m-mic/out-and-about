import mongoose from "mongoose";

// Mongoose Schema für Sportarten
const CategorySchema = new mongoose.Schema({
  _id: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Activity" }],
});

export const Category = mongoose.model("Category", CategorySchema);
