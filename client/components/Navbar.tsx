import { useState } from 'react';
import { useSelector } from 'react-redux';
import LoginButton from './LoginButton';
import { IGlobalState } from '../store';
import Link from 'next/link';

export default function() {
  const client = useSelector((state: IGlobalState) => state.client);
  const [burgerActive, setBurgerActive] = useState(false);

  return (
    <nav className="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <Link href="/">
          <a className="navbar-item">
            <img src="/img/logo.png" width="66" height="28"/>
          </a>
        </Link>

        <a role="button" className={`navbar-burger burger ${burgerActive ? 'is-active' : ''}`} onClick={() => setBurgerActive(!burgerActive)} aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbar" className={`navbar-menu ${burgerActive ? 'is-active' : ''}`}>
        {
          client &&
          <div className="navbar-start">
            <Link href="/"><a className="navbar-item">Dashboard</a></Link>
            
            {
              client.isAdmin && 
              <div className="navbar-item has-dropdown is-hoverable">
                <a className="navbar-link">
                  Administration
                </a>

                <div className="navbar-dropdown">
                  <Link href="/users"><a className="navbar-item">Users</a></Link>
                  <Link href="/deployment"><a className="navbar-item">Deploy an application</a></Link>
                </div>
              </div>
            }
          </div>
        }

        <div className="navbar-end">
          {
            client &&
            <Link href="/profile"><a className="navbar-item">{client.username}</a></Link>
          }
          <div className="navbar-item">
            <LoginButton isLoading={false} logout={!!client}/>
          </div>
        </div>
      </div>
    </nav>
  );
};