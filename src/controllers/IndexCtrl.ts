import { NextFunction, Request, Response } from 'express';

export function getIndex(req: Request, res: Response, next: NextFunction) {
  res
    .status(200)
    .send(
      '<h1 style="color: green;">"GPAO.Node.js.ts": Restful Web services, test</h1>'
    );
}
