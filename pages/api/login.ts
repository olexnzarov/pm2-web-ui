import { IApiRequest, IApiResponse } from '../../server/api';
import { UserModel, User } from '../../server/models/user';
import { database, session, method, combine } from '../../server/middlewares';
import * as validate from '../../shared/validation';

const login = async (req: IApiRequest, res: IApiResponse) => {
  const { username, password } = req.body;

  if (!validate.all(validate.username(username), validate.password(password))) {
    res.status(400).json({ message: 'Invalid username or password.' });
    return;
  }

  const user = await UserModel.findOne({ username, hashedPassword: User.hash(password) }) as User;

  if (!user) {
    res.status(403).json({ message: 'User with given username and password was not found.' });
    return;
  }

  req.session.userId = (user as any)._id;
  res.status(200).json(user.getPublicData());
};

export default combine(method('POST'), database, session, login);