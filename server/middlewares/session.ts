import session, { withSession } from 'next-session';
import * as mongoose from 'mongoose';
import connectMongo from 'connect-mongo';

const MongoStore = connectMongo(session);

let store;
export default (fn) => withSession(fn, { 
  storePromisify: true, 
  store: store ? store : (store = new MongoStore({ mongooseConnection: mongoose.connection })),
});