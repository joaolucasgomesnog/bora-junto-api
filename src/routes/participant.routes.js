
import Participant from "../modules/Participant/index.js";
import { Router } from "express";

const participantRoutes = Router();

participantRoutes.post("/add", Participant.createParticipant)
participantRoutes.post("/exists", Participant.getParticipantById)


export {participantRoutes}