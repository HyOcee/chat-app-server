import User from "../models/user";

export const get_all_users = async (req: any, res: any) => {
  try {
    const users = await User.find().select('username _id firstName lastName');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const patch_user = async (req: any, res: any) => {
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }
  if (req.body.username != null) {
    res.user.username = req.body.username;
  }

  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const delete_user = async (req: any, res: any) => {
  try {
    await res.user.remove();
    res.json({ message: `Successfully deleted ${res.user.username}` });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};


export const get_user = (req: any, res: any) => {
    res.json(res.user);
  }