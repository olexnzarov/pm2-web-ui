import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IGlobalState } from '../store';
import axios from 'axios';

export const withAuth = (Component) => {
  function login(props) {
    const dispatch = useDispatch();
    const isSynced = useSelector((state: IGlobalState) => state.authSynced);

    useEffect(() => {
      if (!isSynced) {
        axios.get('/api/auth')
          .then(({ data: { user } }) => dispatch({ type: 'auth', client: user }))
          .catch(() => dispatch({ type: 'auth', client: null }));
      }
    }, [isSynced]);

    return <Component {...props} />
  };

  return login;
};