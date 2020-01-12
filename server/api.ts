import { NextApiRequest, NextApiResponse } from 'next';
import { User } from './models/user';

export interface ISession {
  userId?: string;
};

export interface IApiRequest extends NextApiRequest {
  session: ISession;
  user?: User;
};

export interface IApiResponse extends NextApiResponse {};