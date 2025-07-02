import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { extractErrorMessage, createSafeError } from "./errorUtils";

const API_BASE_Production = "https://lostmatcher-api.onrender.com/api-v1";
// Use your local IP or Android emulator host for development
// Example for Android emulator:
// const API_BASE_Development = "http://10.0.2.2:5001/api-v1";
// Example for real device on same Wi-Fi (replace with your actual IP):
const API_BASE_Development = "http://192.168.43.205:5001/api-v1";
// const API_BASE_Development = "http://10.0.2.2:5001/api-v1";
const API_BASE =
	typeof __DEV__ !== "undefined" && __DEV__
		? API_BASE_Development
		: API_BASE_Production;

const axiosInstance = axios.create({
	baseURL: API_BASE,
	// Do not set Content-Type here; let it be set per request
});

export class ApiError extends Error {
	status: number;
	data: any;
	constructor(message: string, status: number, data?: any) {
		super(message);
		this.status = status;
		this.data = data;
	}
}

async function getToken() {
	return AsyncStorage.getItem("token");
}

async function request(path: string, options: any = {}, isFormData = false) {
	const token = await getToken();
	let headers: Record<string, string> = options.headers
		? { ...options.headers }
		: {};
	if (token) headers["Authorization"] = `Bearer ${token}`;
	if (!isFormData) headers["Content-Type"] = "application/json";

	try {
		const response = await axiosInstance.request({
			url: path,
			method: options.method || "GET",
			data: options.body,
			headers,
			// For FormData, let axios set the Content-Type
		});
		return response.data;
	} catch (error: any) {
		if (error.isAxiosError === true) {
			const status = error.response?.status || 500;
			const data = error.response?.data;

			// Use utility function to extract clean error message
			const message = extractErrorMessage(data || error);

			// Create clean error data using utility function
			const safeError = createSafeError({ message, status, ...data });

			throw new ApiError(message, status, safeError);
		} else {
			const message = extractErrorMessage(error);
			throw new ApiError(message, 500);
		}
	}
}
export const api = {
	async register(body: any) {
		// If username is missing, generate it from firstName (or name)
		let payload = { ...body };
		if (!payload.username) {
			const base = payload.firstName || payload.name || "user";
			payload.username =
				`${base}`.toLowerCase().replace(/\s+/g, "") +
				Math.floor(Math.random() * 10000);
		}
		return request("/auth/register", {
			method: "POST",
			body: payload,
		});
	},
	async login(body: any) {
		return request("/auth/login", {
			method: "POST",
			body: body,
		});
	},
	async forgotPassword(body: any) {
		return request("/auth/forgot-password", {
			method: "POST",
			body: body,
		});
	},
	async resetPassword(body: any) {
		return request("/auth/reset-password", {
			method: "POST",
			body: body,
		});
	},
	async sendVerificationEmail() {
		return request("/auth/send-verification-email", { method: "POST" });
	},
	async sendVerificationCode(body: any) {
		return request("/auth/send-verification-code", {
			method: "POST",
			body: body, // Expects { email }
		});
	},
	async verifyEmail(body: any) {
		return request("/auth/verify-email", {
			method: "POST",
			body: body, // Now expects { email, code } instead of { token }
		});
	},
	async getMe() {
		return request("/users/me");
	},
	async updateMe(body: any) {
		return request("/users/me", {
			method: "PATCH",
			body: body,
		});
	},
	async logout() {
		await AsyncStorage.removeItem("token");
	},

	// Item Management
	async createItem(formData: FormData) {
		return request(
			"/items",
			{
				method: "POST",
				body: formData,
			},
			true
		);
	},
	async getAllItems() {
		return request("/items");
	},
	async getItemById(id: string) {
		return request(`/items/${id}`);
	},
	async updateItem(id: string, body: any) {
		return request(`/items/${id}`, {
			method: "PUT",
			body: body,
		});
	},
	async deleteItem(id: string) {
		return request(`/items/${id}`, {
			method: "DELETE",
		});
	},

	// Found Reports
	async createFoundReport(formData: FormData) {
		return request(
			"/found",
			{
				method: "POST",
				body: formData,
			},
			true
		);
	},
	async getAllFoundReports() {
		return request("/found");
	},
	async getFoundReportById(id: string) {
		return request(`/found/${id}`);
	},
	async updateFoundReport(id: string, body: any) {
		return request(`/found/${id}`, {
			method: "PUT",
			body: body,
		});
	},
	async deleteFoundReport(id: string) {
		return request(`/found/${id}`, {
			method: "DELETE",
		});
	},

	// Lost Reports
	async createLostReport(formData: FormData) {
		return request(
			"/lost",
			{
				method: "POST",
				body: formData,
			},
			true
		);
	},
	async getAllLostReports() {
		return request("/lost");
	},
	async getLostReportById(id: string) {
		return request(`/lost/${id}`);
	},
	async updateLostReport(id: string, body: any) {
		return request(`/lost/${id}`, {
			method: "PUT",
			body: body,
		});
	},
	async deleteLostReport(id: string) {
		return request(`/lost/${id}`, {
			method: "DELETE",
		});
	},
};

// Example secure error handling for usage:
// try {
//   await api.register(...);
// } catch (err) {
//   if (err instanceof ApiError) {
//     // err.message contains clean, user-friendly error message
//     Alert.alert("Error", err.message);
//     // Safe logging without stack traces
//     logError("Registration failed", err);
//   } else {
//     Alert.alert("Error", "An unexpected error occurred");
//     logError("Unexpected error", err);
//   }
// }
