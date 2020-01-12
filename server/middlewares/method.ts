import { IApiRequest, IApiResponse } from '../api';

type RequestMethod = 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export default (...allowedMethods: RequestMethod[]) => (fn) => {
  const methods = {};
  allowedMethods.forEach(m => methods[m] = true);
  
  return async (req: IApiRequest, res: IApiResponse) => {
    if (!methods[req.method]) {
      res.status(404).send('');
      return;
    }

    return await fn(req, res);
  };
};