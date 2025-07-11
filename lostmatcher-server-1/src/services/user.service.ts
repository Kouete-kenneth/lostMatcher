import httpStatus from "http-status";
import User from "../models/user.model";
import ApiError from "../utils/ApiError";

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody: any): Promise<any> => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter: any, options: any): Promise<any> => {
	// If paginate is not available, use find with limit, skip, and sort for basic pagination
	const { limit = 10, page = 1, sortBy } = options || {};
	const sort: any = {};
	if (sortBy) {
		const [field, order] = sortBy.split(":");
		sort[field] = order === "desc" ? -1 : 1;
	}
	const users = await User.find(filter)
		.sort(sort)
		.limit(limit)
		.skip((page - 1) * limit);
	return users;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id: string): Promise<any> => {
	return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email: string): Promise<any> => {
	return User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
import mongoose from "mongoose";

const updateUserById = async (
	userId: string,
	updateBody: any
): Promise<any> => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	if (
		updateBody.email &&
		(await User.isEmailTaken(
			updateBody.email,
			new mongoose.Types.ObjectId(userId)
		))
	) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}
	Object.assign(user, updateBody);
	await user.save();
	return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: string): Promise<any> => {
	const user = await getUserById(userId);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}
	await user.remove();
	return user;
};

/**
 * Check if email is already registered
 */
const isEmailTaken = async (email: string): Promise<boolean> => {
	const user = await getUserByEmail(email);
	return !!user;
};

export {
	createUser,
	queryUsers,
	getUserById,
	getUserByEmail,
	updateUserById,
	deleteUserById,
	isEmailTaken,
};
