import Item from "../models/items.model";
import { uploadImageToSupabase } from "../utils/uploadimageTo-supabase";
import { ItemUploadService } from "./itemupload.service";
import { Types } from "mongoose";

export class ItemService {
	static async createItemWithImage({
		owner,
		itemDetails,
		attributes,
		file,
	}: {
		owner: string;
		itemDetails: any;
		attributes?: any;
		file: Express.Multer.File;
	}) {
		// Use the existing upload logic
		return ItemUploadService.uploadItemWithImage({
			owner,
			itemDetails,
			attributes,
			file,
		});
	}

	static async getAllItems(filter = {}) {
		return Item.find(filter).populate("owner", "username name avatar");
	}

	static async getItemById(id: string) {
		return Item.findById(id).populate("owner", "username name avatar");
	}

	static async updateItemById(id: string, update: any) {
		return Item.findByIdAndUpdate(id, update, { new: true });
	}

	static async deleteItemById(id: string) {
		return Item.findByIdAndDelete(id);
	}
}
