import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { IGlobalState } from '../store';
import axios from 'axios';
import LoginPage from '../components/LoginPage';

export const withAuth = (Component) => {
  function login(props) {
    const isMounted = useRef(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const { authSynced, client } = useSelector((state: IGlobalState) => ({
      authSynced: state.authSynced,
      client: state.client,
    }), shallowEqual);

    useEffect(() => {
      if (!authSynced) {
        axios.get('/api/me')
          .then(({ data: { user } }) => isMounted && dispatch({ type: 'auth', client: user }))
          .catch((err) => {
            if (!isMounted) { return; }

            const msg = err.response?.data?.message;
            setError(msg ? [err.response.statusText ?? 'Error', msg] : ['Error', err.toString()]);
          });
      }
    }, [authSynced]);

    return client ? <Component {...props} /> : <LoginPage {...props} isLoading={!authSynced && !error} error={error} />;
  };

  return login;
};