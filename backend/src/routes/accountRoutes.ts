import { Account } from "../models/accounts";
import { authenticatedRequest, authenticateJWT } from "../middleware/authenticateJWT";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { denyChangeRequests, secretToken } from "../index";
import { AccountType } from "../interfaces";
import { getDistance } from "geolib";

export const accountRoutes = express.Router();

// POST-Request um E-Mail zu überprüfen
accountRoutes.post("/account/check-email", async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    try {
      const email = req.body.email.toLowerCase();
      // Neuer Account wird erstellt und gespeichert
      const account = await Account.findOne({ email: email });
      if (!account) {
        res.status(200).end();
      } else {
        res.status(403).send("Email already in use");
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  }
});

// POST-Request für Registrierung/Neuerstellung eines Accounts
accountRoutes.post("/account/register", async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    try {
      // Neuer Account wird erstellt und gespeichert
      let accountInfo: AccountType = req.body;
      accountInfo = { ...accountInfo, email: accountInfo.email.toLowerCase() };
      const newAccount = new Account(accountInfo);
      await newAccount.save();
      // Access-Token wird generiert und an Frontend zurückgegeben
      const accessToken = jwt.sign({ id: newAccount.id, password: newAccount.password }, secretToken);
      return res.status(201).send({
        token: accessToken,
        id: newAccount.id,
      });
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      console.log(error.message);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  }
});

// POST-Request für Anmeldung eines Accounts
accountRoutes.post("/account/login", async (req, res) => {
  const credentials = req.body;
  try {
    // Account mit passender Email wird gesucht
    Account.findOne({ email: credentials.email.toLowerCase() }).then((account) => {
      if (!account) {
        return res.status(404).end();
      }
      if (account.password != credentials.password) {
        return res.status(403).end();
      }
      // Access-Token wird generiert und an Frontend zurückgegeben
      const accessToken = jwt.sign({ id: account.id, password: account.password }, secretToken);
      return res.send({
        token: accessToken,
        id: account.id,
      });
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return res.status(400).send(error.message);
  }
});

// GET-Request für alle Informationen des eigenen Accounts
accountRoutes.get("/account/info", authenticateJWT, async (req: Request, res: Response) => {
  const authReq = req as authenticatedRequest;
  const id = authReq.account.id;
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      // Accountdaten des Nutzers werden in der Collection gesucht. id, password, type und tier werden nicht mitgegeben
      const requestedAccount = await Account.findOne(
        { _id: id },
        { _id: false, password: false, saved_activities: false }
      ).populate({
        path: "planned_activities",
        populate: { path: "categories", model: "Category", select: "id name" },
        options: { sort: { date: -1 } },
        select: "id name categories date",
      });
      if (!requestedAccount) {
        res.status(404).send("Account not found");
      }
      return res.send(requestedAccount);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  } else {
    return res.status(403).send("Invalid account id");
  }
});

// GET-Request für alle Informationen des eigenen Accounts
accountRoutes.post("/account/activities", authenticateJWT, async (req: Request, res: Response) => {
  const authReq = req as authenticatedRequest;
  const id = authReq.account.id;
  const userLocation = [authReq.body.long, authReq.body.lat];
  if (mongoose.Types.ObjectId.isValid(id)) {
    try {
      // Accountdaten des Nutzers werden in der Collection gesucht. id, password, type und tier werden nicht mitgegeben
      const requestedAccount = await Account.findOne(
        { _id: id },
        { _id: false, password: false, categories: false, email: false, username: false }
      )
        .populate({
          path: "saved_activities",
          populate: { path: "categories", model: "Category", select: "id name" },
          options: { sort: { date: 1 } },
          select: "id name categories date location",
        })
        .populate({
          path: "planned_activities",
          populate: { path: "categories", model: "Category", select: "id name" },
          options: { sort: { date: 1 } },
          select: "id name categories date location",
        });
      if (!requestedAccount) {
        res.status(404).send("Account not found");
        return;
      }
      for (let i = 0; i < requestedAccount.planned_activities.length; i++) {
        if (requestedAccount.planned_activities[i].date < new Date().valueOf()) {
          requestedAccount.planned_activities.splice(i, 1);
        } else {
          break;
        }
      }

      for (let i = 0; i < requestedAccount.saved_activities.length; i++) {
        if (requestedAccount.saved_activities[i].date < new Date().valueOf()) {
          requestedAccount.saved_activities.splice(i, 1);
        } else {
          break;
        }
      }

      requestedAccount.planned_activities.map((activity) => {
        activity.distance = getDistance(
          { longitude: userLocation[0], latitude: userLocation[1] },
          { longitude: activity.location.coordinates[0], latitude: activity.location.coordinates[1] }
        );
      });

      requestedAccount.saved_activities.map((activity) => {
        activity.distance = getDistance(
          { longitude: userLocation[0], latitude: userLocation[1] },
          { longitude: activity.location.coordinates[0], latitude: activity.location.coordinates[1] }
        );
      });
      return res.send(requestedAccount);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return res.status(400).send(error.message);
    }
  } else {
    return res.status(403).send("Invalid account id");
  }
});

// PATCH-Request zum Aktualisieren der eigenen Informationen
accountRoutes.patch("/account/info", authenticateJWT, async (req: Request, res: Response) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    const authReq = req as authenticatedRequest;
    const id = authReq.account.id;
    const updatedValues = req.body;
    if (mongoose.Types.ObjectId.isValid(id)) {
      try {
        const updated = await Account.findOneAndUpdate({ _id: id }, updatedValues, {
          new: true,
          runValidators: true,
        });
        if (!updated) {
          return res.status(404).send("Account not found");
        }
        return res.send(updated);
      } catch (error) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return res.status(400).send(error.message);
      }
    } else {
      return res.status(403).send("Invalid account id");
    }
  }
});
