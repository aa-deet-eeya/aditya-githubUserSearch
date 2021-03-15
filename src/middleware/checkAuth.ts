import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/users";

// Checks if client is logged in or not
export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get details from the Cookie
    const token = req.cookies["githubUserSearch-session"];
    if (!token) throw new Error("Unauthenticated");

    const { username }: any = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ username }).exec();
    // Incase of wrong Cookie
    if (!user) throw new Error("Unauthenticated");

    res.locals.user = user;

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      desc: "Not Authenticated",
    });
  }
};
