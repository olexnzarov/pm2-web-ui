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

export const combine = (...fns) => {
  const len = fns.length;
  let fn = fns[len - 1];
  
  if (len > 1) {
    for (let i = len - 2; i >= 0; i--) {
      fn = fns[i](fn);
    }
  }

  return fn;
};