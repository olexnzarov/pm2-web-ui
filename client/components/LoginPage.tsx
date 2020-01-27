import { useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { onInput } from '../util';
import Router from 'next/router';
import Input from './Input';
import Navbar from './Navbar';
import * as validate from '../../shared/validation';
import axios from 'axios';

const onLogin = async (username, password) => {
  const { data } = await axios.post('/api/login', { username, password });
  return data;
};

function LoadingPanel() {
  return (
    <div>
      <Navbar />
      <div className="columns is-centered">
        <div className="column is-6-tablet is-5-fullhd" style={{ margin: '40px 25px 20px 25px', textAlign: 'center' }}>
          <p className="subtitle">Loading...</p>
          <progress className="progress is-small is-info is-medium" max="100"/>
        </div>
      </div>
    </div>
  );
}

export default function({ isLoading = false, error = null }) {
  if (isLoading) { return <LoadingPanel />; }

  const isMounted = useRef(true);
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reqError, setError] = useState(null);
  const [validUsername, setValidUsername] = useState(true);
  const [validPassword, setValidPassword] = useState(true);
  const dispatch = useDispatch();
  
  if (username != null) {
    const isValid = validate.username(username);
    if (isValid != validUsername) { setValidUsername(isValid); }
  }

  if (password != null) {
    const isValid = validate.password(password);
    if (isValid != validPassword) { setValidPassword(isValid); }
  }

  if (error && !reqError) { setError(error); }

  return (
    <div>
      <Navbar/>
      <div className="columns is-centered">
        <div className="column is-4-tablet is-3-fullhd" style={{ margin: '40px 25px 20px 25px', textAlign: 'center' }}>
          <h1 className='subtitle'>Login to continue</h1>
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column is-4-tablet is-3-fullhd box" style={{ margin: '10px 25px 25px 25px' }}>
          <Input 
            id="pm2-ui-username"
            name="Username" 
            type="text"
            placeholder="Username" 
            value={username || ''} 
            onChange={onInput(setUsername)} 
            invalidMessage="This username is invalid"
            invalid={!validUsername}
            icon="fa-user"
          />

          <Input 
            id="pm2-ui-password"
            name="Password" 
            type="password"
            placeholder="Password" 
            value={password || ''} 
            onChange={onInput(setPassword)} 
            invalidMessage="This password is invalid"
            invalid={!validPassword}
            icon="fa-lock"
          />

          <div className="field">
            <div className="control">
              <button className={`button is-link is-fullwidth ${loading ? 'is-loading' : ''}`} onClick={async () => {
                if (!validUsername || !validPassword) { return; }

                setLoading(true);

                try {
                  const data = await onLogin(username, password);

                  if (isMounted) {
                    dispatch({ type: 'auth', client: data });
                    
                    setLoading(false);
                    Router.push('/');
                  }
                } 
                catch(err) {
                  if (isMounted) {
                    const msg = err.response?.data?.message;
                    setLoading(false);
                    setError(msg ? [err.response.statusText ?? 'Error', msg] : ['Error', err.toString()]);
                  }
                }
              }}>Login</button>
            </div>
          </div>

          {
            reqError &&
            <article className="message is-danger">
              <div className="message-header">
                <p>{reqError[0]}</p>
                <button className="delete" aria-label="delete" onClick={() => setError(null)}></button>
              </div>
              <div className="message-body">
                {reqError[1]}
              </div>
            </article>
          }
        </div>
      </div>
    </div>
  );
};