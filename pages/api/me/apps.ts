import { IApiRequest, IApiResponse } from '../../../server/api';
import { database, session, method, authenticate, combine } from '../../../server/middlewares';

const onRequest = async (req: IApiRequest, res: IApiResponse) => {
  const { apps = [] } = req.user;
  res.status(200).json({ apps });
};

export default combine(method('GET'), database, session, authenticate({ required: true }), onRequest);