// API Endpoint Documentation for lostmatcher-client
// Each endpoint includes method, path, input, and output (TypeScript types)

// 1. Authentication & User Management

/**
 * Register User
 * POST /api/auth/register
 * Input: RegisterInput
 * Output: AuthToken | ErrorResponse
 */
export interface RegisterInput {
	name: string;
	email: string;
	password: string;
}

/**
 * Login User
 * POST /api/auth/login
 * Input: LoginInput
 * Output: AuthToken | ErrorResponse
 */
export interface LoginInput {
	email: string;
	password: string;
}

/**
 * Check Registration
 * POST /api/auth/check-registration
 * Input: { email: string }
 * Output: { isRegistered: boolean }
 */

/**
 * Forgot Password
 * POST /api/auth/forgot-password
 * Input: { email: string }
 * Output: { success: boolean } | ErrorResponse
 */

/**
 * Reset Password
 * POST /api/auth/reset-password
 * Input: { email: string; code: string; newPassword: string }
 * Output: { success: boolean } | ErrorResponse
 */

/**
 * Send Verification Email
 * POST /api/auth/send-verification
 * Input: { email: string }
 * Output: { success: boolean } | ErrorResponse
 */

/**
 * Verify Email
 * POST /api/auth/verify-email
 * Input: { email: string; code: string }
 * Output: { success: boolean } | ErrorResponse
 */

/**
 * Get Current User
 * GET /api/auth/me
 * Headers: Authorization: Bearer <token>
 * Output: { user: User } | ErrorResponse
 */

// 2. Onboarding State
/**
 * POST /api/user/onboarding-complete
 * Headers: Authorization: Bearer <token>
 * Input: {}
 * Output: { success: boolean }
 */

// 3. Lost & Found Items

/**
 * Report Lost/Found Item
 * POST /api/items
 * Headers: Authorization: Bearer <token>
 * Input: CreateItemInput
 * Output: { success: boolean; item: Item } | ErrorResponse
 */
export interface CreateItemInput {
	type: "lost" | "found";
	title: string;
	description: string;
	image: string; // base64 or file url
	location?: {
		lat: number;
		lng: number;
		address?: string;
	};
}

/**
 * Search Items
 * GET /api/items/search?q=... or ?image=...
 * Output: { items: Item[] }
 */

/**
 * Get Matched Items
 * GET /api/items/matches
 * Headers: Authorization: Bearer <token>
 * Output: { matches: Item[] }
 */

/**
 * Claim Item
 * POST /api/items/:id/claim
 * Headers: Authorization: Bearer <token>
 * Input: {}
 * Output: { success: boolean; claim: Claim } | ErrorResponse
 */

/**
 * Approve/Reject Claim
 * POST /api/items/:id/approve-claim
 * Headers: Authorization: Bearer <token>
 * Input: { claimId: string; approve: boolean }
 * Output: { success: boolean }
 */

/**
 * Get User's Items
 * GET /api/user/items
 * Headers: Authorization: Bearer <token>
 * Output: { items: Item[] }
 */

/**
 * Get User's Claims
 * GET /api/user/claims
 * Headers: Authorization: Bearer <token>
 * Output: { claims: Claim[] }
 */

// 4. Notifications

/**
 * Get Notifications
 * GET /api/notifications
 * Headers: Authorization: Bearer <token>
 * Output: { notifications: Notification[] }
 */

/**
 * Mark Notification as Read
 * POST /api/notifications/:id/read
 * Headers: Authorization: Bearer <token>
 * Output: { success: boolean }
 */

// 5. Profile

/**
 * Get Profile
 * GET /api/user/profile
 * Headers: Authorization: Bearer <token>
 * Output: { user: User }
 */

/**
 * Update Profile
 * PUT /api/user/profile
 * Headers: Authorization: Bearer <token>
 * Input: { name?: string; avatar?: string }
 * Output: { success: boolean; user: User }
 */

// 6. Error Response
export interface ErrorResponse {
	error: string;
}
