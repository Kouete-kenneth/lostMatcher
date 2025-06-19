import { Request, Response } from "express";
import { MatchDescription } from "../services/match.service";

/**
 * Handles the matching request.
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 */
const matchDescriptionsController = async (req: Request, res: Response): Promise<void> => {
  const { targetimage, matchArray }: { targetimage: string; matchArray: string[] } = req.body;
  const matchDescArray: string[] = matchArray.map((text: string) => text.toLowerCase());
  const targetDescription: string = targetimage.toLowerCase();

  try {
    const matches = MatchDescription(targetDescription, matchDescArray);
    res.send(matches);
  } catch (error: any) {
    res.status(500).send({ error: error.message });
  }
};

export {
  matchDescriptionsController
};