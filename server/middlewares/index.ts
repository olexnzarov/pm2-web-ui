import { IApiRequest, IApiResponse } from '../api';

import database from './database';
import method from './method';
import session from './session';
import authenticate from './authenticate';
import pm2 from './pm2';

export {
  database,
  method,
  session,
  authenticate,
  pm2,
};

const handleExceptions = (fn) => {
  return async (req: IApiRequest, res: IApiResponse) => {
    try {
      await fn(req, res);
    }
    catch (err) {
      const responded = (res as any)._headerSent;
      const status = err.status ?? 500;
      const message = err.message ?? err.toString();

      if (!responded) { res.status(status).json({ message }); }
      if (!status) { console.error(err); }
    }
  };
};

export class RequestError extends Error {
  public message: string;
  public status: number;

  constructor(message, status = 500) {
    super();

    this.message = message;
    this.status = status;
  }
};

export const combine = (...fns) => {
  const len = fns.length;
  let fn = fns[len - 1];
  
  if (len > 1) {
    for (let i = len - 2; i >= 0; i--) {
      fn = fns[i](fn);
    }
  }

  return handleExceptions(fn);
};