import { useState } from 'react';
import { useSelector } from 'react-redux';
import LoginButton from './LoginButton';
import { IGlobalState } from '../store';
import Link from 'next/link';

export default function() {
  const client = useSelector((state: IGlobalState) => state.client);
  const [burgerActive, setBurgerActive] = useState(false);

  return <nav className="navbar has-shadow is-spaced" role="navigation" aria-label="main navigation">
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
      <div className="navbar-start">
        <a className="navbar-item">
          Home
        </a>

        <a className="navbar-item">
          Documentation
        </a>

        <div className="navbar-item has-dropdown is-hoverable">
          <a className="navbar-link">
            More
          </a>

          <div className="navbar-dropdown">
            <a className="navbar-item">
              About
            </a>
            <a className="navbar-item">
              Jobs
            </a>
            <a className="navbar-item">
              Contact
            </a>
            <hr className="navbar-divider"/>
            <a className="navbar-item">
              Report an issue
            </a>
          </div>
        </div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <LoginButton isLoading={false} logout={!!client}/>
        </div>
      </div>
    </div>
  </nav>;
};