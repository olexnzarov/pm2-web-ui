export enum AppStatus {
  ONLINE = 'online',
  STOPPING = 'stopping',
  STOPPED = 'stopped',
  LAUNCHING = 'launching',
  ERRORED = 'errored',
  ONE_LAUNCH = 'one-launch-status',
};

export enum ExecMode {
  CLUSTER = 'cluster_mode',
  FORK = 'fork_mode',
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
  watch?: boolean;
};

export interface IPM2Monitoring {
  memory: number;
  cpu: number;
}

export interface IAppInstance {
  pid: number;
  pm_id: number;
  monit: IPM2Monitoring;
  name: string;
  pm2_env: IPM2Environment;
};

export interface IApp {
  name: string;
  pm_id: number;
  exec_mode: ExecMode;
  instances: IAppInstance[];
}