import pm from 'pm2';
import { IApp, IAppInstance, ExecMode } from '../shared/pm2';

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

export const stopApp = (name) => new Promise((resolve, reject) => pm.stop(name, (err) => err ? reject(err) : resolve()));

export const restartApp = (name) => new Promise((resolve, reject) => pm.restart(name, (err) => err ? reject(err) : resolve()));

export const reloadApp = (name) => new Promise((resolve, reject) => pm.reload(name, (err) => err ? reject(err) : resolve()));

export const deleteApp = (name) => new Promise((resolve, reject) => pm.delete(name, (err) => err ? reject(err) : resolve()));