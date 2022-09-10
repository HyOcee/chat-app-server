import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/authentication";
import User from "../models/user";
import bcrypt from "bcrypt";

export const sign_up = async (req: any, res: any) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      username: req.body.username,
      hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    });
    try {
      const newUser = await user.save();
      res.status(201).json("successfully created user");
    } catch (err: any) {
      res.status(400).json({ message: err.message });
    }
  } catch {
    res.status(501).send("error signing up");
  }
};

export const log_in = async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    const userInDb: any = await User.findOne({ username });
    if (userInDb == null) {
      return res.status(400).json({ message: "Cannot find user" });
    } else {
      try {
        if (await bcrypt.compare(password, userInDb!.hashedPassword)) {
          let accessToken = generateAccessToken({
            username: userInDb!.username,
            id: userInDb!._id,
            firstName: userInDb!.firstName,
            lastName: userInDb!.lastName
          });
          let refreshToken = generateRefreshToken({});
          if (accessToken && refreshToken) {
            res.json({ accessToken, refreshToken });
          } else {
            res.status(500).send("internal error");
          }
        } else {
          res.status(403).send("go away");
        }
      } catch {
        res.status(500).send("internal error");
      }
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};
