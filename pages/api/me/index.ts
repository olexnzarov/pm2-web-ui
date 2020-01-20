import { IApiRequest, IApiResponse } from '../../../server/api';
import { database, session, method, authenticate, combine } from '../../../server/middlewares';

const onRequest = async (req: IApiRequest, res: IApiResponse) => {
  const user = req.user ? req.user.getPublicData() : null;
  res.status(200).json({ user });
};

export default combine(method('GET'), database, session, authenticate(), onRequest);