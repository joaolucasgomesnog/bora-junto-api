
import Participant from "../modules/EventParticipant/index.js";
import { Router } from "express";

const participantRoutes = Router();

participantRoutes.post("/add", Participant.createParticipant)
participantRoutes.post("/exists", Participant.getParticipantById)
participantRoutes.delete("/delete", Participant.deleteParticipantById)

export {participantRoutes}