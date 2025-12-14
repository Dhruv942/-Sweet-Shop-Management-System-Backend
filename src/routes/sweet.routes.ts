import { Router } from "express";
import {
  createSweet,
  getSweets,
  searchSweets,
  updateSweet,
  deleteSweet,
} from "../controllers/sweet.controller";
import { authenticate, isAdmin } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authenticate, createSweet);
router.get("/", authenticate, getSweets);
router.get("/search", authenticate, searchSweets);
router.put("/:id", authenticate, updateSweet);
router.delete("/:id", authenticate, isAdmin, deleteSweet);

export default router;
