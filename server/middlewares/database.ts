import { IApiRequest, IApiResponse } from '../api';
import * as mongoose from 'mongoose';

import config from '../config';

export default (fn) => {
  return async (req: IApiRequest, res: IApiResponse) => {
    if (mongoose.connection?.readyState != 1) {
      await mongoose.connect(config.mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }

    return await fn(req, res);
  };
};