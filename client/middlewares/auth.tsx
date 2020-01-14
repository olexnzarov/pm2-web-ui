import { useEffect } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { IGlobalState } from '../store';
import axios from 'axios';
import LoginPage from '../components/LoginPage';

export const withAuth = (Component) => {
  function login(props) {
    const dispatch = useDispatch();
    const { authSynced, client } = useSelector((state: IGlobalState) => ({
      authSynced: state.authSynced,
      client: state.client,
    }), shallowEqual);

    useEffect(() => {
      if (!authSynced) {
        axios.get('/api/auth')
          .then(({ data: { user } }) => dispatch({ type: 'auth', client: user }))
          .catch(() => dispatch({ type: 'auth', client: null }));
      }
    }, [authSynced]);

    return client ? <Component {...props} /> : <LoginPage {...props} isLoading={!authSynced} />;
  };

  return login;
};