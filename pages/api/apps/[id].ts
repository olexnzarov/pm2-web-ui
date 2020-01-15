import { IApiRequest, IApiResponse } from '../../../server/api';
import { pm2, authenticate, database, session, method, combine } from '../../../server/middlewares';
import { getApp } from '../../../server/pm2';
import { UserAppRight } from '../../../server/models/user';

const onGet = async (req: IApiRequest, res: IApiResponse) => {
  const { user, query } = req;
  const { id } = query;

  if (!user.isAdmin && !user.hasRight(id as string, UserAppRight.VIEW)) {
    res.status(403).json({ message: 'You do not have access to this application.' });
    return;
  }

  const app = await getApp(id);

  if (!app) {
    res.status(404).json({ message: 'This application does not exist.' });
    return;
  }

  res.status(200).json({ app });
};

const onPost = (req: IApiRequest, res: IApiResponse) => {
  const { action } = req.body;
  console.log(action);
  res.status(200).json({ message: 'ok' });
};

const onRequest = (req: IApiRequest, res: IApiResponse) => req.method === 'GET' ? onGet(req, res) : onPost(req, res);

export default combine(method('GET', 'POST'), database, session, authenticate({ required: true }), pm2, onRequest);