import pm from 'pm2';
import { IApp } from '../shared/pm2';

export const getList = () => new Promise<IApp[]>((resolve, reject) => pm.list((err, list: any) => err ? reject(err) : resolve(list)));
