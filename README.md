<h1 align="center">
  <a href="https://github.com/alexnzarov/pm2ui"><img src="https://github.com/alexnzarov/pm2-web-ui/raw/master/public/img/logo.png" alt="pm2-web-ui" width="200"></a>
  <br>
</h1>

<h4 align="center">Modern <a href="https://github.com/Unitech/pm2" target="_blank">PM2</a> web interface built with <a href="https://github.com/zeit/next.js" target="_blank">next.js</a></h4>

<p align="center">
  <img src="https://img.shields.io/badge/status-work%20in%20progress-yellowgreen?style=flat-square" alt="work in progress">
  <a href="https://github.com/alexnzarov/pm2-web-ui/raw/master/LICENSE.md">
    <img src="https://img.shields.io/github/license/alexnzarov/pm2-web-ui?style=flat-square" alt="license">
  </a>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#license">License</a>
</p>

[![pm2-web-ui](https://i.imgur.com/QvSb9sX.png)](https://github.com/alexnzarov/pm2-web-ui)

## Key Features

> What you can do?

* [x] Monitoring - see up-to-date information about your applications (their statuses, RAM and CPU usage, etc.).
* [x] Management - restart, stop or delete an existing application.
* [ ] Deployment - start a new Node.js application using the PM2.
* [ ] Interaction - send data or signals to the running applications.

> What does it have?

* [x] Authentication and permissions system - you can configure users with different abilities and access to the applications.

## How To Use

> How to download?

```
$ git clone git@github.com:alexnzarov/pm2-web-ui.git
$ cd pm2-web-ui
$ npm i
```

> How to configure?

This application is configured via environment variables, here's the list:
- SALT
- MONGODB_URI

> How to start the server?

```
$ npm run build
$ npm run start
```

> How to start the server with pm2? 

```
$ npm run build
$ pm2 start npm --name "pm2-web-ui" -- start
(optional)
$ pm2 save
```

> How to login?

After you configured and started the server, user will be created with the following credentials:

**Username**: root

**Password** is the same as `SALT` that you specified in the environment.

## License

This project is distributed under the MIT license (see the LICENSE file in the project root). 

---

> GitHub [@alexnzarov](https://github.com/alexnzarov) &nbsp;&middot;&nbsp;
> Telegram [@alexnzarov](https://t.me/alexnzarov)
