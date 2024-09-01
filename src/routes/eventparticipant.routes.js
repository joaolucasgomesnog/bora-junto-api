import EventParticipant from "../modules/EventParticipant/index.js";
import { Router } from "express";

const eventParticipantRoutes = Router();

eventParticipantRoutes.post("/add", EventParticipant.createParticipant)
eventParticipantRoutes.post("/exists", EventParticipant.getParticipantById)
eventParticipantRoutes.delete("/delete", EventParticipant.deleteParticipantById)

export {eventParticipantRoutes}