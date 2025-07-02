import { Request, Response, NextFunction } from "express";
import { ItemService } from "../services/item.service";

interface AuthRequest extends Request {
	user?: { id: string };
}

export const createItemController = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { itemDetails, attributes } = req.body;
		if (!req.user || !req.user.id) {
			res.status(401).json({ message: "Unauthorized" });
			return;
		}
		const owner = req.user.id;
		const file = req.file;
		if (!file) {
			res.status(400).json({ message: "Image file is required" });
			return;
		}

		// Parse itemDetails if it's a string (from FormData)
		let parsedItemDetails = itemDetails;
		if (typeof itemDetails === "string") {
			try {
				parsedItemDetails = JSON.parse(itemDetails);
			} catch (e) {
				res.status(400).json({ message: "Invalid itemDetails format" });
				return;
			}
		}

		// Parse attributes if it's a string (from FormData)
		let parsedAttributes = attributes;
		if (typeof attributes === "string") {
			try {
				parsedAttributes = JSON.parse(attributes);
			} catch (e) {
				// attributes is optional, so ignore parse errors
				parsedAttributes = {};
			}
		}

		const item = await ItemService.createItemWithImage({
			owner,
			itemDetails: parsedItemDetails,
			attributes: parsedAttributes,
			file,
		});
		res.status(201).json(item);
	} catch (err) {
		next(err);
	}
};

export const getAllItemsController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const items = await ItemService.getAllItems();
		res.json(items);
	} catch (err) {
		next(err);
	}
};

export const getItemByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const item = await ItemService.getItemById(req.params.id);
		if (!item) {
			res.status(404).json({ message: "Item not found" });
			return;
		}
		res.json(item);
	} catch (err) {
		next(err);
	}
};

export const updateItemByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const item = await ItemService.updateItemById(req.params.id, req.body);
		if (!item) {
			res.status(404).json({ message: "Item not found" });
			return;
		}
		res.json(item);
	} catch (err) {
		next(err);
	}
};

export const deleteItemByIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const item = await ItemService.deleteItemById(req.params.id);
		if (!item) {
			res.status(404).json({ message: "Item not found" });
			return;
		}
		res.json({ message: "Item deleted" });
	} catch (err) {
		next(err);
	}
};
