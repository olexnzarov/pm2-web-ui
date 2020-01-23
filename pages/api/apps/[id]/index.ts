import { IApiRequest, IApiResponse } from '../../../../server/api';
import { pm2, authenticate, database, session, method, combine, RequestError } from '../../../../server/middlewares';
import { getApp, stopApp, deleteApp, reloadApp, restartApp } from '../../../../server/pm2';
import { AppAction } from '../../../../shared/actions';
import { UserAppRight } from '../../../../shared/user';

const onGet = async (req: IApiRequest, res: IApiResponse) => {
  const { user, query } = req;
  const { id } = query;

  if (!user.isAdmin && !user.hasRight(id as string, UserAppRight.VIEW)) {
    throw new RequestError('You do not have access to this application.', 403);
  }

  const app = await getApp(id);

  if (!app) {
    throw new RequestError('This application does not exist.', 404);
  }

  res.status(200).json({ app });
};

const actions = {
  [AppAction.DELETE]: { fn: deleteApp, right: UserAppRight.DELETE },
  [AppAction.STOP]: { fn: stopApp, right: UserAppRight.MANAGE },
  [AppAction.RELOAD]: { fn: reloadApp, right: UserAppRight.MANAGE },
  [AppAction.RESTART]: { fn: restartApp, right: UserAppRight.MANAGE },
  [AppAction.START]: { fn: restartApp, right: UserAppRight.MANAGE },
};

const onPost = async (req: IApiRequest, res: IApiResponse) => {
  const { query, user } = req;
  const { action } = req.body;
  const { id } = query;

  const { fn, right } = actions[action];

  if (!user.isAdmin && !user.hasRight(id as string, right)) {
    throw new RequestError('You don\'t have enough permissions to do this.', 403);
  }

  try {
    await fn(id);
    res.status(200).json({});
  }
  catch (err) {
    throw new RequestError(err.message ?? err.toString());
  }
};

const onRequest = (req: IApiRequest, res: IApiResponse) => req.method === 'GET' ? onGet(req, res) : onPost(req, res);

export default combine(method('GET', 'POST'), database, session, authenticate({ required: true }), pm2, onRequest);