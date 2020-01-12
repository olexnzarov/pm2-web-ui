import { IApiRequest, IApiResponse } from '../../server/api';
import { database, session, method, combine } from '../../server/middlewares';

const logout = async (req: IApiRequest, res: IApiResponse) => {
  delete req.session.userId;
  res.status(200).json({});
};

export default combine(method('POST'), database, session, logout);