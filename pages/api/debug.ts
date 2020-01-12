import { IApiRequest, IApiResponse } from '../../server/api';
import { database, session, authenticate, combine } from '../../server/middlewares';

const auth = (req: IApiRequest, res: IApiResponse) => {
  res.status(200).json({ user: req.user, ...req.session });
};

export default combine(database, session, authenticate(), auth);