import { IApiRequest, IApiResponse } from '../../../server/api';
import { pm2, authenticate, database, session, method, combine } from '../../../server/middlewares';
import { getList } from '../../../server/pm2';
import { UserAppRight } from '../../../server/models/user';

const getApp = async (req: IApiRequest, res: IApiResponse) => {
  const { user, query } = req;
  const { id } = query;

  if (!user.isAdmin && !user.hasRight(id as string, UserAppRight.VIEW)) {
    res.status(403).json({ message: 'You do not have access to this application.' });
    return;
  }

  const list = await getList();
  const app = list.find(a => a.name === id);

  if (!app) {
    res.status(404).json({ message: 'This application does not exist.' });
    return;
  }

  res.status(200).json({ app: list.find(a => a.name === id) });
};

export default combine(method('GET'), database, session, authenticate({ required: true }), pm2, getApp);