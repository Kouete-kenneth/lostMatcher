import httpStatus from "http-status";
import {
  createReview,
  getAllReviews,
  deleteReview as deleteReviewService,
  getReviewByUserID,
  getReviewByRating,
  getReviewByDateAdded,
} from "../services/review.service";
import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";

const reviewController = {
  createReview: catchAsync(async (req: Request, res: Response) => {
    const newReview = await createReview(req.body);
    res.status(httpStatus.CREATED).json(newReview);
  }),

  getAllReviews: catchAsync(async (req: Request, res: Response) => {
    const reviewData = await getAllReviews();
    res.status(httpStatus.OK).json(reviewData);
  }),

  deleteReview: catchAsync(async (req: Request, res: Response) => {
    const { review_id } = req.params;
    const result = await deleteReviewService(review_id);
    res.status(httpStatus.OK).send(result);
  }),

  getReviewByUserID: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const reviews = await getReviewByUserID(id);
    res.status(httpStatus.OK).json(reviews);
  }),

  getReviewByRating: catchAsync(async (req: Request, res: Response) => {
    const { rating } = req.params;
    const numericRating = Number(rating);
    const reviews = await getReviewByRating(numericRating);
    res.status(httpStatus.OK).json(reviews);
  }),

  getReviewByDateAdded: catchAsync(async (req: Request, res: Response) => {
    const { date } = req.params;
    const reviews = await getReviewByDateAdded(date);
    res.status(httpStatus.OK).json(reviews);
  }),
};

export default reviewController;
