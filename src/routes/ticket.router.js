import { Router } from "express";
import { passportCall } from "../middlewares/passport-call.js";
import { ticketRepository } from "../repository/ticket.repository.js";
import passport from "passport";

const router = Router();

router.post("/purchase", 
    passportCall('jwt', { session: false }), 
    ticketRepository.generateTicket
);

export default router;