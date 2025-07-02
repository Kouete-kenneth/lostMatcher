import mongoose, { Document, Model, Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import toJSON from "./plugins/toJSON.plugin";
import paginate from "./plugins/paginate.plugin";

export enum AccountStatus {
	Active = "active",
	Suspended = "suspended",
}

export interface IUser extends Document {
	username: string;
	email: string;
	password: string;
	name?: string; // Add name field for frontend compatibility
	profilePicture?: string;
	avatar?: string; // Alias for profilePicture for frontend compatibility
	isEmailVerified?: boolean; // Add email verification status
	emailVerificationCode?: string; // Add verification code
	emailVerificationExpires?: Date; // Add verification code expiration
	onboardingComplete?: boolean; // Add onboarding status
	contactDetails?: {
		phone?: string;
		address?: {
			region?: string;
			town?: string;
			quarter?: string;
		};
	};
	registrationDate?: Date;
	accountStatus: AccountStatus;
	matchingThreshold: number;
	notificationPreferences?: {
		matchAlerts?: boolean;
		generalUpdates?: boolean;
	};
	periodicSearchEnabled?: boolean;
	isPasswordMatch(password: string): Promise<boolean>;
}

export interface IUserModel extends Model<IUser> {
	isEmailTaken(
		email: string,
		excludeUserId?: mongoose.Types.ObjectId
	): Promise<boolean>;
	isUsernameTaken(
		username: string,
		excludeUserId?: mongoose.Types.ObjectId
	): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error("Invalid email");
				}
			},
		},
		name: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value: string) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error(
						"Password must contain at least one letter and one number"
					);
				}
			},
			private: true as any,
		},
		profilePicture: {
			type: String,
			trim: true,
		},
		isEmailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationCode: {
			type: String,
			trim: true,
		},
		emailVerificationExpires: {
			type: Date,
		},
		onboardingComplete: {
			type: Boolean,
			default: false,
		},
		contactDetails: {
			phone: { type: String, trim: true },
			address: {
				region: { type: String, trim: true },
				town: { type: String, trim: true },
				quarter: { type: String, trim: true },
			},
		},
		registrationDate: {
			type: Date,
			default: Date.now,
		},
		accountStatus: {
			type: String,
			enum: Object.values(AccountStatus),
			default: AccountStatus.Active,
		},
		matchingThreshold: {
			type: Number,
			default: 70,
		},
		notificationPreferences: {
			matchAlerts: { type: Boolean, default: true },
			generalUpdates: { type: Boolean, default: true },
		},
		periodicSearchEnabled: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

// Virtual field for avatar (maps to profilePicture for frontend compatibility)
userSchema.virtual("avatar").get(function () {
	return this.profilePicture;
});

// Ensure virtual fields are included in JSON output
userSchema.set("toJSON", { virtuals: true });

userSchema.statics.isEmailTaken = async function (
	email: string,
	excludeUserId?: mongoose.Types.ObjectId
): Promise<boolean> {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.statics.isUsernameTaken = async function (
	username: string,
	excludeUserId?: mongoose.Types.ObjectId
): Promise<boolean> {
	const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (
	password: string
): Promise<boolean> {
	const user = this as IUser;
	return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export default User;
