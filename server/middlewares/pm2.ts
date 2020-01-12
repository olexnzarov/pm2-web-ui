import { IApiRequest, IApiResponse } from '../api';
import pm from 'pm2';

const state = {
  connected: false,
  stable: true,
};

const connect = (noDaemon: boolean = false) => new Promise((resolve, reject) => pm.connect(noDaemon, (err) => err ? reject(err) : resolve()));
const disconnect = () => new Promise((resolve, reject) => pm.list((err) => err ? reject(err) : resolve()));

export default (fn) => {
  return async (req: IApiRequest, res: IApiResponse) => {
    try {
      if (!state.stable) {
        await disconnect();

        state.connected = false;
        state.stable = true;
      }

      if (!state.connected) {
        await connect();

        state.connected = true;
        state.stable = true;
      }
    } 
    catch(err) {
      state.connected = false;
      
      res.status(500).json({ message: `pm2: ${err}` });
      return;
    }
    
    await fn(req, res);
  };
};

export const getState = () => state;