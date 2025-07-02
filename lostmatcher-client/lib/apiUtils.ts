// Utility functions for API requests

export interface ItemDetailsType {
	name: string;
	description: string;
	category: string;
}

export interface CreateItemData {
	itemDetails: ItemDetailsType;
	attributes?: Record<string, string>;
	file: File | any; // File from image picker
}

export interface CreateFoundReportData {
	itemDetails: ItemDetailsType;
	attributes?: Record<string, string>;
	foundDate: string; // ISO date string
	foundLocation: string;
	file: File | any; // File from image picker
}

export interface CreateLostReportData {
	itemDetails: ItemDetailsType;
	attributes?: Record<string, string>;
	lostDate: string; // ISO date string
	lostLocation: string;
	file: File | any; // File from image picker
}

/**
 * Create FormData for item creation
 */
export function createItemFormData(data: CreateItemData): FormData {
	const formData = new FormData();

	formData.append("file", data.file);
	formData.append("itemDetails", JSON.stringify(data.itemDetails));

	if (data.attributes) {
		formData.append("attributes", JSON.stringify(data.attributes));
	}

	return formData;
}

/**
 * Create FormData for found report creation
 */
export function createFoundReportFormData(
	data: CreateFoundReportData
): FormData {
	const formData = new FormData();

	formData.append("file", data.file);
	formData.append("itemDetails", JSON.stringify(data.itemDetails));
	formData.append("foundDate", data.foundDate);
	formData.append("foundLocation", data.foundLocation);

	if (data.attributes) {
		formData.append("attributes", JSON.stringify(data.attributes));
	}

	return formData;
}

/**
 * Create FormData for lost report creation
 */
export function createLostReportFormData(data: CreateLostReportData): FormData {
	const formData = new FormData();

	formData.append("file", data.file);
	formData.append("itemDetails", JSON.stringify(data.itemDetails));
	formData.append("lostDate", data.lostDate);
	formData.append("lostLocation", data.lostLocation);

	if (data.attributes) {
		formData.append("attributes", JSON.stringify(data.attributes));
	}

	return formData;
}

/**
 * Helper to format dates for API
 */
export function formatDateForApi(date: Date): string {
	return date.toISOString();
}
