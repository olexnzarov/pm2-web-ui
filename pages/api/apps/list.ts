import { IApiRequest, IApiResponse } from '../../../server/api';
import { pm2, combine } from '../../../server/middlewares';
import pm from 'pm2';

const getList = () => new Promise((resolve, reject) => pm.list((err, list) => err ? reject(err) : resolve(list)));

const list = async (req: IApiRequest, res: IApiResponse) => {
  const list = await getList();
  res.status(200).json(list);
};

export default combine(pm2, list);