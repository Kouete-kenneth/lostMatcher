import express from "express";
import multer from "multer";
import type { RequestHandler } from "express";
import {
	createItemController,
	getAllItemsController,
	getItemByIdController,
	updateItemByIdController,
	deleteItemByIdController,
} from "../controllers/item.controller";
// import validate from '../middlewares/validate';
// import { createItem, updateItem, getItem, deleteItem } from '../validations/item.validation';
import { auth } from "../middlewares/auth";

const router = express.Router();
const upload = multer();

// Route to create a new item
router.post(
	"/",
	auth(),
	upload.single("file"),
	createItemController as RequestHandler
);

// Route to get all items
router.get("/", getAllItemsController as RequestHandler);

// Route to get a specific item by ID
router.get("/:id", getItemByIdController as RequestHandler);

// Route to update an item by ID
router.put("/:id", auth(), updateItemByIdController as RequestHandler);

// Route to delete an item by ID
router.delete("/:id", auth(), deleteItemByIdController as RequestHandler);

export default router;
