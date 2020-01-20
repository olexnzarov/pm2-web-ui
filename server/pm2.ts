import pm from 'pm2';
import { IApp, IAppInstance, ExecMode } from '../shared/pm2';

import _fs from 'fs';
import * as bluebird from 'bluebird';

const fs = bluebird.promisifyAll(_fs);

export const getList = () => new Promise<IAppInstance[]>((resolve, reject) => pm.list((err, list: any) => err ? reject(err) : resolve(list)));

export const getApp = async (name): Promise<IApp> => {
  const list = await getList();
  const apps = [];
  
  for (let i = 0; i < list.length; i++) {
    const app = list[i];

    if (app.name != name) { continue; }

    apps.push(app);

    if (app.pm2_env.exec_mode !== ExecMode.CLUSTER) { break; }
  }

  const temp = apps[0];
  
  if (!temp) { return null; }

  return {
    name: temp.name,
    pm_id: temp.pm_id,
    exec_mode: temp.pm2_env.exec_mode,
    instances: apps,
  };
};

const getDescription = (pmId) => new Promise<IAppInstance[]>((resolve, reject) => pm.describe(pmId, (err, list: any) => err ? reject(err) : resolve(list)));

export const getLogs = async (pmId) => {
  const [app] = await getDescription(pmId);

  if (!app) { throw 'Application does not exist.'; }

  const { pm_out_log_path, pm_err_log_path } = app.pm2_env;

  const response = {
    app,
    output: pm_out_log_path ? await fs.readFileAsync(pm_out_log_path, 'utf8') : 'There is no log file provided.',
    error: pm_err_log_path ? await fs.readFileAsync(pm_err_log_path, 'utf8') : 'There is no log file provided.',
  };

  return response;
};

export const stopApp = (name) => new Promise((resolve, reject) => pm.stop(name, (err) => err ? reject(err) : resolve()));

export const restartApp = (name) => new Promise((resolve, reject) => pm.restart(name, (err) => err ? reject(err) : resolve()));

export const reloadApp = (name) => new Promise((resolve, reject) => pm.reload(name, (err) => err ? reject(err) : resolve()));

export const deleteApp = (name) => new Promise((resolve, reject) => pm.delete(name, (err) => err ? reject(err) : resolve()));