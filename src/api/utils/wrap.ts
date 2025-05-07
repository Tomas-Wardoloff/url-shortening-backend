import { Request, Response, NextFunction, RequestHandler } from "express";

export function wrap(fn: (...args: any[]) => Promise<any>): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch(next);
  };
}

export default wrap;
