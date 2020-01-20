import { IApiRequest, IApiResponse } from '../../../../../server/api';
import { getLogs } from '../../../../../server/pm2';
import { database, session, method, authenticate, combine, RequestError } from '../../../../../server/middlewares';
import { UserAppRight } from '../../../../../shared/user';

const onRequest = async (req: IApiRequest, res: IApiResponse) => {
  const { query, user } = req;
  const { id, instanceId } = query;

  if (!user.isAdmin && !user.hasRight(id as string, UserAppRight.VIEW)) {
    throw new RequestError('You do not have access to this application.', 403);
  }

  const { app, output, error } = await getLogs(instanceId);

  if (app.name != id) {
    throw new RequestError('Application name and pm2 identifier mismatch.');
  }

  res.status(200).json({ output, error });
};

export default combine(method('GET'), database, session, authenticate({ required: true }), onRequest);