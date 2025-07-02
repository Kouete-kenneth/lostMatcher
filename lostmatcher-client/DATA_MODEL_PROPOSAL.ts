// Proposed data models for lostmatcher-client (TypeScript interfaces)

export interface User {
	_id: string;
	name: string;
	email: string;
	passwordHash: string; // not sent to frontend
	avatar?: string;
	isEmailVerified: boolean;
	onboardingComplete: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthToken {
	token: string;
	user: User;
}

export interface Item {
	_id: string;
	type: "lost" | "found";
	title: string;
	description: string;
	imageUrl: string;
	owner: string; // userId
	status: "open" | "matched" | "claimed" | "recovered" | "closed";
	createdAt: Date;
	updatedAt: Date;
	location?: {
		lat: number;
		lng: number;
		address?: string;
	};
	matchedItemId?: string;
}

export interface Claim {
	_id: string;
	itemId: string;
	claimantId: string;
	status: "pending" | "approved" | "rejected";
	createdAt: Date;
	updatedAt: Date;
}

export interface Notification {
	_id: string;
	userId: string;
	type: "match" | "claim" | "admin" | "system";
	title: string;
	message: string;
	read: boolean;
	createdAt: Date;
}

export interface PasswordResetToken {
	_id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	used: boolean;
}

export interface EmailVerificationToken {
	_id: string;
	userId: string;
	token: string;
	expiresAt: Date;
	used: boolean;
}
