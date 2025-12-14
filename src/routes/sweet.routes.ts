import { Router } from "express";
import { createSweet } from "../controllers/sweet.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createSweet);

export default router;
