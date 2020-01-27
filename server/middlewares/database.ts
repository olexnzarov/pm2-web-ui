import { IApiRequest, IApiResponse } from '../api';
import * as mongoose from 'mongoose';
import { UserModel, User } from '../models/user';

import config from '../config';

export default (fn) => {
  return async (req: IApiRequest, res: IApiResponse) => {
    if (mongoose.connection?.readyState != 1) {
      await mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
      UserModel.updateOne({ username: 'root' }, { $set: { isAdmin: true, hashedPassword: User.hash(config.salt) } }, { upsert: true })
        .catch((err) => console.error(`Failed to update the root user: ${err}`));
    }

    return await fn(req, res);
  };
};