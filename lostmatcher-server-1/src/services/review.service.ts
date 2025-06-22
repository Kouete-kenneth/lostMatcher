import Review from "../models/feedback.model";

/**
 * Create a new review
 * @param {object} reviewData 
 * @returns {Promise<object>} 
 */
const createReview = async (reviewData: any): Promise<any> => {
  try {
    const review = await Review.create(reviewData);
    return review;
  } catch (error) {
    console.error(error);
    throw new Error("Error creating review");
  }
};
/**
 * Get all reviews
 * @returns {Promise<Array>} 
 */
const getAllReviews = async (): Promise<any[]> => {
  try {
    const reviewData = await Review.find({});
    return reviewData;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching reviews");
  }
};

/**
 * Delete a review by its ID
 * @param {string} reviewId 
 * @returns {Promise<object>}
 */
const deleteReview = async (reviewId: string): Promise<any> => {
  try {
    const review = await Review.findByIdAndDelete(reviewId);
    if (review) {
      return review;
    } else {
      throw new Error(`Could not find review with ID: ${reviewId}`);
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting review");
  }
};

/**
 * Get reviews by user ID
 * @param {string} userID 
 * @returns {Promise<Array>} 
 */
const getReviewByUserID = async (userID: string): Promise<any[]> => {
  try {
    const reviews = await Review.find({ userId: userID });
    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching review by user id");
  }
};

/**
 * Get reviews by rating
 * @param {number} rating 
 * @returns {Promise<Array>} 
 */
const getReviewByRating = async (rating: number): Promise<any[]> => {
  try {
    const reviews = await Review.find({ rating: rating });
    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching reviews by rating");
  }
};

/**
 * Get reviews by date added
 * @param {string} date  
 * @returns {Promise<Array>} 
 */
const getReviewByDateAdded = async (date: string): Promise<any[]> => {
  try {
    const reviews = await Review.find({ date_made: date });

    if (!reviews || reviews.length === 0) {
      throw new Error(`Could not find reviews added on: ${date}`);
    }

    return reviews;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching reviews by date");
  }
};

export {
  createReview,
  getAllReviews,
  deleteReview,
  getReviewByUserID,
  getReviewByRating,
  getReviewByDateAdded,
};