import express, { Request, Response, Router } from "express";

import userModel from "../models/users";
import checkAuth from "../middleware/checkAuth";

const favs = async (req: Request, res: Response) => {
  const { favName } = req.body;

  try {
    if (!favName) throw new Error("Empty username");

    const user = res.locals.user;
    const newUser: any = await userModel
      .findOne({ username: user.username })
      .exec();

    console.log(newUser.favs.includes(favName));
    console.log("Before", newUser);
    if (newUser.favs.includes(favName))
      newUser.favs = newUser.favs.filter((fav) => fav !== favName);
    else newUser.favs.push(favName);
    console.log("After", newUser);

    newUser.save();

    return res.status(200).json({
      success: true,
      newUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      msg: "Oopps!!!! Something went wrong",
      errors: err,
    });
  }
};

const router = Router();
router.post("/", checkAuth, favs);

export default router;
