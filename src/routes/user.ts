import express, { Request, Response, Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import cookie from "cookie";

import userModel from "../models/users";
import checkAuth from "../middleware/checkAuth";

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    let errors: any = {};

    //Check if email already exists

    const emailExist = await userModel.find({ email });
    if (emailExist.length > 0) errors.email = "Email Already Taken";

    const userExist = await userModel.find({ username });
    if (userExist.length > 0) errors.username = "Username Already Taken";

    if (Object.keys(errors).length > 0)
      return res.status(402).json({
        success: false,
        errors,
      });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new userModel({
      //   _id:
      email,
      username,
      passwordHash,
    });

    user.save();

    // Return the user
    return res.json({
      success: true,
      message: "Successfully created User",
      user: user,
    });
  } catch (err) {
    // Log the error
    console.log(err);

    // Return the error
    return res.status(500).json({
      success: false,
      msg: "Oopps!!!! Something went wrong",
      errors: err,
    });
  }
};

//Login
const login = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;

  try {
    // Validate fields
    let user;
    let errors: any = {};
    if (!email && !username) errors.username = "Username cannot be empty";
    if (!password || password.trim() === "")
      errors.password = "Password cannot be empty";

    if (Object.keys(errors).length > 0)
      return res.status(400).json({
        success: false,
        msg: "Empty Field(s)",
        errors: errors,
      });

    const userFromUsername = await userModel.findOne({ username }).exec();
    const userFromEmail = await userModel.findOne({ email }).exec();

    if (!userFromEmail && !userFromUsername)
      return res.status(400).json({
        success: false,
        msg: "Incorrect Username or Password",
      });
    else if (userFromUsername) user = userFromUsername;
    else user = userFromEmail;

    // Check Password
    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches)
      return res.status(401).json({
        success: false,
        msg: "Incorrect Username or Password",
      });

    // Login using above credentials
    const token = jsonwebtoken.sign({ username }, process.env.JWT_SECRET);
    // Store the session token in cookie
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.set(
      "Set-Cookie",
      cookie.serialize("githubUserSearch-session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        // sameSite: "strict",
        maxAge: 2592000, // 30 days
        path: "/",
      })
    );
    return res.status(200).json({
      success: true,
      msg: "Login Successfull",
      user: token,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      success: false,
      msg: "Authentication Faliure",
      errors: err,
    });
  }
};

// Logout from Client
const logout = (req: Request, res: Response) => {
  // Set Cookie token to null and expire it
  res.set(
    "Set-Cookie",
    cookie.serialize("githubUserSearch-session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      expires: new Date(0),
      path: "/",
    })
  );

  return res.status(200).json({
    success: true,
    msg: "Successfully Logged out",
  });
};

// Check Self-Authentication
const isAuthenticated = async (_: Request, res: Response) => {
  return res.json({
    success: true,
    msg: "Authenticated",
    user: res.locals.user,
  });
};

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/isAuthenticated", checkAuth, isAuthenticated);

export default router;
