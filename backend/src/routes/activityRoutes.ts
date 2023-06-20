import express from "express";
import { Activity } from "../models/activities";
import mongoose from "mongoose";
import { ActivityType } from "../interfaces";
import { constructPreferenceModel, searchActivities, shuffleArray } from "../scripts/activitiesScripts";
import { authenticatedRequest, authenticateJWT } from "../middleware/authenticateJWT";
import { Account } from "../models/accounts";
import { Category } from "../models/categories";
import { denyChangeRequests } from "../index";

export const activityRoutes = express.Router();

// POST-Request zum Erstellen einer Aktivität
activityRoutes.post("/activity/", async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    //const authReq = req as authenticatedRequest;
    //const id = authReq.account.id;
    try {
      // Neue Aktivität wird erstellt und gespeichert
      const newActivity = await new Activity({ ...req.body });
      await newActivity.save();
      // Daten der neuen Aktivität werden in die activities Liste des Übungsleiters geschrieben
      /* await Account.findOneAndUpdate(
        { _id: id },
        {
          $addToSet: {
            planned_activities: newActivity._id,
          },
        }
      ); */
      for (const categoryId in newActivity.categories) {
        await Category.findOneAndUpdate({ _id: categoryId }, { $addToSet: { activities: newActivity._id } });
      }
      // Neue Aktivität wird zurückgegeben
      return res.status(201).send(newActivity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  }
});

// GET-Request zum Abrufen einer spezifischen Aktivität
activityRoutes.get("/activity/:activityId", authenticateJWT, async (req, res) => {
  const authReq = req as unknown as authenticatedRequest;
  const id = authReq.params.activityId;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      const requestedActivity = await Activity.findOne({ _id: id })
        .populate("organizer", "id username")
        .populate("categories", "id name");
      if (!requestedActivity) {
        return res.status(404).send("Activity not found");
      }
      res.send(requestedActivity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  } else {
    return res.status(403).send("Invalid activity id");
  }
});

activityRoutes.get("/activity/:activityId/participants", authenticateJWT, async (req, res) => {
  const authReq = req as unknown as authenticatedRequest;
  const accountId = authReq.account.id;
  const activityId = authReq.params.activityId;
  if (mongoose.Types.ObjectId.isValid(activityId)) {
    try {
      const activity = await Activity.findOne(
        { _id: activityId, organizer: accountId },
        { id: true, name: true, club: true, participants: true, trainers: true }
      ).populate("participants", "id username email");
      if (!activity) {
        return res.status(404).send("Cannot access activity");
      }
      return res.send(activity);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  } else {
    return res.status(403).send("Invalid activity id");
  }
});

// PATCH-Request zum Aktualisieren einer Aktivität
activityRoutes.patch("/activity/:activityId", authenticateJWT, async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    const authReq = req as unknown as authenticatedRequest;
    const updatedActivity = authReq.body;
    const accountId = authReq.account.id;
    const activityId = authReq.params.activityId;
    console.log(updatedActivity);
    if (mongoose.Types.ObjectId.isValid(activityId)) {
      try {
        const updated = await Activity.findOneAndUpdate({ _id: activityId, organizer: accountId }, updatedActivity, {
          new: true,
          runValidators: true,
        });
        if (!updated) {
          return res.status(404).send("Cannot access activity");
        }
        return res.send(updated);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return res.status(400).send(error.message);
      }
    } else {
      return res.status(403).send("Invalid activity id");
    }
  }
});

activityRoutes.patch("/activity/:activityId/save", authenticateJWT, async (req, res) => {
  const authReq = req as unknown as authenticatedRequest;
  const accountId = new mongoose.Types.ObjectId(authReq.account.id);
  const activityId = authReq.params.activityId;
  if (mongoose.Types.ObjectId.isValid(activityId)) {
    try {
      let response = "";
      const activity = await Activity.findOne({ _id: activityId });
      if (activity) {
        if (activity.participants.includes(accountId)) {
          const index = activity.participants.indexOf(accountId);
          activity.participants.splice(index, 1);
          await Account.updateOne(
            { _id: accountId },
            {
              $pull: { saved_activities: activityId },
            },
            {
              runValidators: true,
            }
          ).then(() => (response += `deleted account id ${accountId} from activity id ${activityId}\n`));
        } else {
          activity.participants.push(accountId);
          await Account.updateOne(
            { _id: accountId },
            {
              $addToSet: { saved_activities: activityId },
            },
            {
              runValidators: true,
            }
          ).then(() => (response += `added account id ${accountId} from activity id ${activityId}\n`));
        }
        activity.save();
        res.send(response);
      } else {
        res.status(404).send("Activity not found");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  } else {
    return res.status(403).send("Invalid activity id");
  }
});

// DELETE-Request zum Löschen einer Aktivität
activityRoutes.delete("/activity/:activityId", authenticateJWT, async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    const id = req.params.activityId;
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const deleted = await Activity.findOneAndDelete({ _id: id });
        if (!deleted) {
          return res.status(404).send("Activity not found");
        }
        // Aktivität wird aus allen angemeldeten Accounts gelöscht
        await Account.updateMany({ saved_activities: id }, { $pull: { saved_activities: id } });
        await Account.updateMany({ planned_activities: id }, { $pull: { planned_activities: id } });
        // Aktivität wird aus verbundener Präferenz gelöscht
        await Category.updateMany({ activities: id }, { $pull: { activities: id } });
        return res.send(`Successfully deleted activity ${deleted._id}`);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return res.status(400).send(error.message);
      }
    } else {
      return res.status(403).send("Invalid activity id");
    }
  }
});

// GET-Request von Aktivitäten anhand von Suchbegriff
activityRoutes.get("/search/:query", authenticateJWT, async (req, res) => {
  const authReq = req as unknown as authenticatedRequest;
  // Seitenanzahl für den Request
  const page: number = parseInt(<string>authReq.query.page) || 0;
  // Anzahl an Elementen pro Seite
  const limit: number = parseInt(<string>authReq.query.limit) || 15;

  const preferences: boolean = authReq.query.preferences === "true";

  const id = authReq.account.id;
  const searchQuery: string = authReq.params.query.toLowerCase();
  try {
    let response;
    response = { last_page: false };
    // Account des Request-Senders wird gesucht und dessen Präferenzen werden verwendet, um die relevantesten
    // Ergebnisse als Erstes zu zeigen
    const account = await Account.findOne({ _id: id });
    let preferenceModel;
    if (preferences) {
      preferenceModel = constructPreferenceModel(account, null);
    } else {
      preferenceModel = {};
    }
    // TODO: Hier muss nach Distanz anhand von GeoJSON Daten sortiert werden. Der Standort des Nutzers muss mit im Body des Requests übergeben werden
    let activities: ActivityType[] = await Activity.find(preferenceModel, {
      only_logged_in: false,
      participants: false,
      organizer: false,
      information_text: false,
      maximum_participants: false,
    }).populate("categories", "id name");
    if (searchQuery) activities = searchActivities(searchQuery, activities);
    const totalResults = activities.length;
    const startIndex = page * limit;
    const endIndex = (page + 1) * limit;
    // Setzt last_page auf true, falls es nicht mehr Ergebnisse auf anderen Seiten gibt
    if (endIndex >= totalResults) {
      response.last_page = true;
    }
    activities = activities.slice(startIndex, endIndex);
    response = { ...response, activities: activities };
    res.send(response);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});

// GET-Request von Aktivitäten anhand von Suchbegriff
activityRoutes.get("/recommendations/", authenticateJWT, async (req, res) => {
  const authReq = req as unknown as authenticatedRequest;
  const preferences: boolean = <string>authReq.query.filtered === "true";
  const id = authReq.account.id;
  try {
    const account = await Account.findOne({ _id: id });
    let preferenceModel;
    if (preferences) {
      preferenceModel = constructPreferenceModel(account, null);
    } else {
      preferenceModel = {};
    }
    // TODO: Hier muss nach Distanz anhand von GeoJSON Daten sortiert werden. Der Standort des Nutzers muss mit im Body des Requests übergeben werden
    const activities: ActivityType[] = await Activity.find(preferenceModel, {
      only_logged_in: false,
      participants: false,
      organizer: false,
      information_text: false,
      maximum_participants: false,
    }).populate("categories", "id name");
    res.send(activities);
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});

// Gibt zufällig 8 verschiedene Aktivitäten zurück
activityRoutes.get("/landing-page/", async (req, res) => {
  try {
    // TODO: filter inactive activities based on date
    let activities = await Activity.find(
      { only_logged_in: false },
      {
        only_logged_in: false,
        participants: false,
        organizer: false,
        information_text: false,
        maximum_participants: false,
        date: false,
        location: false,
        categories: false,
      }
    );
    activities = shuffleArray(activities);
    return res.send(activities.slice(0, 8));
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});
