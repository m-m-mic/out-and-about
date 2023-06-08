import express from "express";
import { Category } from "../models/categories";
import { authenticateJWT } from "../middleware/authenticateJWT";

import { denyChangeRequests } from "../index";

export const categoryRoutes = express.Router();

// Adds new category
categoryRoutes.post("/category/", async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    try {
      const newCategory = new Category({ ...req.body });
      await newCategory.save();
      return res.status(201).send(newCategory);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  }
});

// GET-Request for all categories
categoryRoutes.get("/category/", async (req, res) => {
  try {
    const categories = await Category.find({}, { activities: false, __v: false }).sort({ name: 1 });
    return res.send(categories);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});

// GET Request for a specific category with all activities
categoryRoutes.get("/category/:categoryId", authenticateJWT, async (req, res) => {
  const id = req.params.categoryId;
  try {
    const category = await Category.findOne({ _id: id }).populate({
      path: "activities",
      populate: { path: "category", model: "Category", select: "id name" },
      select: "id name category date",
    });
    if (!category) {
      return res.status(404).send("Category not found");
    }
    return res.send(category);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});
