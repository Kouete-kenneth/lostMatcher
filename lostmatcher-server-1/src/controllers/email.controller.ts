// import { Request, Response } from 'express';
// import Email from '../models/email.model';
// import { sendEmailFrom } from '../services/email.service.js';

// export const createEmail = async (req: Request, res: Response): Promise<void> => {
//   const { from, subject, message } = req.body as { from: string; subject: string; message: string };

//   try {
//     const email = new Email({
//       to: 'kouete678@gmail.com',
//       from,
//       subject,
//       message,
//     });

//     await email.save();
//     await sendEmailFrom(from, subject, message);

//     res.status(201).send(email);
//   } catch (error: any) {
//     console.log(error);
//     res.status(400).send(error);
//     throw new Error(error?.message || 'Unknown error');
//   }
// };