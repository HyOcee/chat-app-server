import jwt from "jsonwebtoken";

export const authenticateToken = (req: any, res: any, next: any) => {
  // const authHeader = req.headers['authorization']
  // const token = authHeader && authHeader.split(' ')[1]
  const token = req.body.accessToken;

  if (token == null) return res.sendStatus(401);

  if (process.env.ACCESS_TOKEN_SECRET) {
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      }
    );
  }
};

export const authenticateTokenForSocket = (token: string): any  => {
  let user: any;
  if(!token) return user;
  if (process.env.ACCESS_TOKEN_SECRET) {
    user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      (err: any, user: any) => {
        if(err) return err;
        return user
      }
    );
  } 
  
  return user
}

export const generateAccessToken = (user: any) => {
  if (process.env.ACCESS_TOKEN_SECRET) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30000s" });
  } else {
    return false;
  }
};

export const generateRefreshToken = (user: any) => {
  if (process.env.REFRESH_TOKEN_SECRET) {
    return jwt.sign({}, process.env.REFRESH_TOKEN_SECRET);
  } else {
    return false;
  }
};
