import { Router } from "express";
import { createSweet, getSweets } from "../controllers/sweet.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, getSweets);

export default router;
