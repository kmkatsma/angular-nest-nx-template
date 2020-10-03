import { Injectable, NestMiddleware } from '@nestjs/common';
import * as cls from 'cls-hooked';
import { RequestContext } from './models';
import { Response } from 'express';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: Function) {
    const requestContext = new RequestContext(req, res);
    const session =
      cls.getNamespace(RequestContext.nsid) ||
      cls.createNamespace(RequestContext.nsid);
    session.run(async () => {
      //stores current request context by the class name ('RequestContext')
      session.set(RequestContext.name, requestContext);
      next();
    });
  }
}
