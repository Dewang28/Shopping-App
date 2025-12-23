import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization
  if (!header) return res.status(401).end()

  const token = header.split(" ")[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET as string)

  ;(req as any).user = decoded
  next()
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user.role !== "admin") return res.status(403).end()
  next()
}
