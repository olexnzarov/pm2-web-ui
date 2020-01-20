import Router from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { withRedux } from '../client/middlewares/redux';
import { withAuth } from '../client/middlewares/auth'; 
import axios from 'axios';
import Navbar from '../client/components/Navbar';

const redirect = () => Router.push('/');

export default withRedux(withAuth(function() {
  const isMounted = useRef(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.post('/api/logout')
      .then(() => {
        if (!isMounted) { return; }

        dispatch({ type: 'auth', client: null });
        redirect();
      })
      .catch((err) => {
        if (!isMounted) { return; }

        const msg = err.response?.data?.message;
        setError(msg ? [err.response.statusText ?? 'Error', msg] : ['Error', err.toString()]);
      });
  }, []);

  return <div>
    <Navbar/>
    <div className="columns is-centered">
      <div className="column is-4-tablet is-3-fullhd box" style={{ margin: '40px 25px 20px 25px', textAlign: 'center' }}>
        <h1 className='subtitle'>Logging out...</h1>
        <progress className={`progress is-small ${error ? 'is-danger' : 'is-info'}`} max="100"></progress>

      {
        error &&
        <article className="message is-danger">
          <div className="message-header">
            <p>{error[0]}</p>
            <button className="delete" aria-label="delete" onClick={() => setError(null)}></button>
          </div>
          <div className="message-body">
            {error[1]}
          </div>
        </article>
      }
      </div>
    </div>
  </div>;
}));