import { IApiRequest, IApiResponse } from '../../../server/api';
import { pm2, authenticate, database, session, method, combine } from '../../../server/middlewares';
import { getList } from '../../../server/pm2';
import { UserAppRight } from '../../../shared/user';

const list = async (req: IApiRequest, res: IApiResponse) => {
  const list = await getList();
  const { user } = req;
  const apps = user.isAdmin ? list : list.filter(a => user.hasRight(a.name, UserAppRight.VIEW));
  
  res.status(200).json({ apps });
};

export default combine(method('GET'), database, session, authenticate({ required: true }), pm2, list);