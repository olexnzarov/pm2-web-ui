import { IAppInstance, AppStatus } from "../../../shared/pm2";
import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../../client/util';
import ErrorDisplay from '../ErrorDisplay';

const tabs = [
  { title: 'Monitoring', element: MonitoringTab },
  { title: 'Details', element: DetailsTab },
  { title: 'Environment', element: EnvironmentTab },
  { title: 'Logs', element: LogsPanel },
];

function LogsPanel(props) {
  const { name, pm_id } = props.app as IAppInstance;
  const { data, error, isValidating } = useSWR(`/api/apps/${name}/${pm_id}/logs`, fetcher, { refreshInterval: 3000 });

  if (error) { return <ErrorDisplay title={error.response?.statusText ?? 'Error'} text={error.response?.data?.message ?? error.toString()} /> }

  return (
    <div>
      <div className="field">
        <label className="label">Output Logs</label>
        <div className={`control ${(!data || isValidating) ? 'is-loading' : ''}`}>
          <textarea className="textarea" readOnly rows={15} value={data?.output.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')} />
        </div>
      </div>
      <div className="field">
        <label className="label">Error Logs</label>
        <div className={`control ${(!data || isValidating) ? 'is-loading' : ''}`}>
          <textarea className="textarea" readOnly rows={15} value={data?.error.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '')} />
        </div>
      </div>
    </div>
  );
}

function EnvironmentTab(props) {
  const { name, pm2_env } = props.app as IAppInstance;
  const { env } = pm2_env;

  const keys = Object.keys(env).filter(k => k != name);
  return (
    <div className="table-container" style={{ width: '100%' }}>
      <table className="table is-narrow is-fullwidth is-bordered auto-overflow" style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th>env_variable</th>
            <th>value</th>
          </tr>
        </thead>
        <tbody>
          {
            keys.length === 0 ? <tr><td colSpan={2}>There are no environment variables.</td></tr> :
            keys.map(k => <tr key={k}><td>{k}</td><td>{env[k].toString()}</td></tr>)
          }
        </tbody>
      </table>
    </div>
  );
}

function DetailsTab(props) {
  const { pid, pm_id, name, pm2_env } = props.app as IAppInstance;
  const { pm_exec_path, exec_mode, exec_interpreter, restart_time, unstable_restarts, pm_out_log_path, pm_err_log_path } = pm2_env;

  return (
    <div>
      <div className="field">
        <label className="label">Script Path</label>
        <div className="control">
          <input className="input" type="text" value={pm_exec_path} readOnly />
        </div>
      </div>

      <label className="label">Output Path</label>
      <div className="field is-grouped">
        <div className="control is-expanded">
          <input className="input" type="text" value={pm_out_log_path} readOnly />
        </div>
        <div className="control is-expanded">
          <input className="input" type="text" value={pm_err_log_path} readOnly />
        </div>
      </div>

      <table className="table is-fullwidth is-bordered">
        <thead>
          <tr>
            <th>pm_id</th>
            <th>pid</th>
            <th>exec_mode</th>
            <th>exec_interpreter</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{pm_id}</td>
            <td>{pid}</td>
            <td>{exec_mode}</td>
            <td>{exec_interpreter}</td>
          </tr>
        </tbody>
        <thead>
          <tr>
            <th colSpan={2}>restarts</th>
            <th colSpan={2}>unstable_restarts</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>{restart_time}</td>
            <td colSpan={2}>{unstable_restarts}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const bytesInMb = 1024**2;
function MonitoringTab(props) {
  const { monit, pm2_env } = props.app as IAppInstance;
  const { cpu, memory } = monit;
  const { status } = pm2_env;

  return (
    <table className="table status-table is-fullwidth is-centered">
      <thead>
        <tr className={`is-size-5 ${(status === AppStatus.ONLINE || status === AppStatus.ONE_LAUNCH) ? 'is-online' : 'is-offline'}`}>
          <th>status</th>
          <th>memory</th>
          <th>cpu</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{status}</td>
          <td>{(memory / bytesInMb).toFixed(2)}mb</td>
          <td>{cpu}%</td>
        </tr>
      </tbody>
    </table>
  );
};

export default function({ ...props }) {
  const [tabIndex, setTab] = useState(0);

  const app = props.app as IAppInstance;

  const { pid } = app;
  const Element = tabs[tabIndex].element;
  
  return (
    <div className="box">
      <div>
        <p style={{ marginBottom: '-2rem' }}>pid: {pid}</p>
      </div>
      <div className="tabs is-centered">
        <ul>
          {tabs.map((t, index) => <li key={t.title} className={index == tabIndex ? 'is-active' : ''} onClick={() => setTab(index)}><a>{t.title}</a></li>)}
        </ul>
      </div>
      {<Element app={app} />}
    </div>
  );
}
