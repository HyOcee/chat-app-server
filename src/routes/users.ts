import express from "express";
import { authenticateToken } from "../auth/authentication";
import { delete_user, get_all_users, get_user, patch_user } from "../controllers/users-controller";
import User from "../models/user";

export const usersRoute = express.Router();

const getUser = async (req: any, res: any, next: any) => {
  let user: any;
  try {
    const user = await User.findById(req.params.id);
    if (user == null) {
      return res.Status.json({ message: "Cannot find user" });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }

  next();
  res.user = user;
};

// should change to get
usersRoute.post("/", authenticateToken ,get_all_users);

usersRoute.get("/:id", authenticateToken, getUser, get_user);

usersRoute.post("/", (req, res) => {});

usersRoute.patch("/:id", getUser, patch_user);

usersRoute.delete("/:id", getUser, delete_user);
