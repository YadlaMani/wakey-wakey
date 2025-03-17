import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);

  if (!token) {
    res.status(401).json({
      message: "No token provided in the header",
      success: false,
    });
    return;
  }

  const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
    algorithms: ["RS256"],
  });

  if (!decoded) {
    res.status(401).json({
      message: "Invalid token or token expired",
      success: false,
    });
    return;
  }
  const userId = (decoded as any).sub;
  if (!userId) {
    res.status(401).json({
      message: "Invalid token or token expired",
      success: false,
    });
    return;
  }

  req.userId = userId;

  next();
}
