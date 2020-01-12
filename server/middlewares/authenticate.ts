import { IApiRequest, IApiResponse } from '../api';
import { UserModel } from '../models/user';

interface IAuthOptions {
  required?: boolean;
};

export default (options: IAuthOptions = {}) => (fn) => {
  return async (req: IApiRequest, res: IApiResponse) => {
    if (!req.session.userId) {
      req.user = null;

      if (options.required) {
        res.status(403).send('');
        return;
      }
    }

    req.user = await UserModel.findById(req.session.userId);

    return await fn(req, res);
  };
};