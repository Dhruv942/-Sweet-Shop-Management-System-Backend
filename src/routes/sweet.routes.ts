import { Router } from "express";
import {
  createSweet,
  getSweets,
  searchSweets,
} from "../controllers/sweet.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, getSweets);
router.get("/search", authenticate, searchSweets);

export default router;
