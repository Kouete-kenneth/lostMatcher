import express from "express";
import reviewController from '../controllers/review.controller';
import validate from '../middlewares/validate';
import {createReviewValidation,deleteReviewValidation} from '../validations/review.validation';

const reviewRoutes = express.Router();

reviewRoutes.post('/create', validate({ body: createReviewValidation }), reviewController.createReview);
reviewRoutes.get('/all', reviewController.getAllReviews);
reviewRoutes.get('/id/:id', reviewController.getReviewByUserID);
reviewRoutes.get('/rating/:rating', reviewController.getReviewByRating);
reviewRoutes.get('/date/:date', reviewController.getReviewByDateAdded);
reviewRoutes.delete('/delete/:id', validate({ params: deleteReviewValidation }), reviewController.deleteReview);

export default reviewRoutes;