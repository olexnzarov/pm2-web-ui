import { createStore, applyMiddleware, Dispatch } from 'redux';
import { useDispatch as _useDispatch } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { IAppOwnership } from '../shared/user';

export interface IAuthedClient {
  id: string;
  username: string;
  isAdmin: boolean;
  apps: IAppOwnership[];
};

export interface IGlobalState {
  client: IAuthedClient;
  authSynced: boolean;
};

const initialState: IGlobalState = {
  authSynced: false,
  client: null,
};

const reducers = {
  auth: (state, action) => ({ ...state, client: action.client, authSynced: true })
};

const reducer = (state = initialState, action) => {
  const rd = reducers[action.type];
  return rd ? rd(state, action) : state;
};

export const initializeStore = (state = initialState) => createStore(reducer, state, composeWithDevTools(applyMiddleware()));

