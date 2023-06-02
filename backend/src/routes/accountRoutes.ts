import { Account } from "../models/accounts";
import { authenticatedRequest, authenticateJWT } from "../middleware/authenticateJWT";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { denyChangeRequests, secretToken } from "../index";

export const accountRoutes = express.Router();

// POST-Request für Registrierung/Neuerstellung eines Accounts
accountRoutes.post("/account/register", async (req, res) => {
  if (denyChangeRequests === "true") {
    return res.status(503).send("Change requests are disabled");
  } else {
    try {
      // Neuer Account wird erstellt und gespeichert
      const newAccount = new Account({ ...req.body });
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
      return res.status(400).send(error.message);
    }
  }
});

// POST-Request für Anmeldung eines Accounts
accountRoutes.post("/account/login", async (req, res) => {
  const credentials = req.body;
  try {
    // Account mit passender Email wird gesucht
    Account.findOne({ email: credentials.email }).then((account) => {
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
      const requestedAccount = await Account.findOne({ _id: id }, { _id: false, password: false })
        .populate({
          path: "saved_activities",
          select: "id name categories date",
        })
        .populate({
          path: "planned_activities",
          select: "id name categories date",
        })
        .populate("categories", "id name");
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
