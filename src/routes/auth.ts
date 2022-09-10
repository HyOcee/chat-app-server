import express from "express";
import { log_in, sign_up } from "../controllers/auth-controller";

export const authRoute = express.Router();

authRoute.post("/signup", sign_up);

authRoute.post("/login", log_in);
