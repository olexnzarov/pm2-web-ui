export enum AppStatus {
  ONLINE = 'online',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  LAUNCHING = 'launching',
  ERRORED = 'errored',
  ONE_LAUNCH = 'one-launch-status',
};

export interface IPM2Environment {
  pm_cwd: string;
  pm_out_log_path: string;
  pm_err_log_path: string;
  exec_interpreter: string;
  exec_mode: string;
  pm_uptime: number;
  unstable_restarts: number;
  restart_time: number;
  status: AppStatus;
  instances: number;
  pm_exec_path: string;
  env: object;
};

export interface IPM2Monitoring {
  memory: number;
  cpu: number;
}

export interface IApp {
  pid: number;
  pm_id: number;
  monit: IPM2Monitoring;
  name: string;
  pm2_env: IPM2Environment;
};
