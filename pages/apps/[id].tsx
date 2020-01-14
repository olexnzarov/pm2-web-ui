import { useRouter } from 'next/router';
import useSWR from 'swr';
import { fetcher } from '../../client/util';
import { withRedux } from '../../client/middlewares/redux';
import { withAuth } from '../../client/middlewares/auth'; 

import Layout from '../../client/components/Layout';
import StartButton from '../../client/components/apps/StartButton';
import RestartButton from '../../client/components/apps/RestartButton';
import DeleteButton from '../../client/components/apps/DeleteButton';
import Panel from '../../client/components/Panel';
import ErrorDisplay from '../../client/components/ErrorDisplay';
import { IApp, AppStatus } from '../../shared/pm2';

function DataRow({ name, value }) {
  return <tr>
    <td style={{ textAlign: 'center' }}><b>{name}</b></td>
    <td style={{ textAlign: 'center', width: '100%' }}>{value}</td>
  </tr>;
}

const bytesInMb = 1024**2;
export default withRedux(withAuth(function() {
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isValidating, revalidate } = useSWR(`/api/apps/${id}`, fetcher, { refreshInterval: 8000 });
  const canUpdate = !isValidating && (data || error);

  if (!data || error) {
    return (
      <Layout>
        <Panel title={id} canUpdate={canUpdate} onUpdate={() => revalidate()}>
          {
            error 
            ? <ErrorDisplay style={{ width: '100%' }} title={error.response?.statusText ?? 'Error'} text={error.response?.data?.message ?? error.toString()} />
            : <progress className="progress is-small is-info" max="100">Loading...</progress>
          }
        </Panel>
      </Layout>
    );
  }

  const { app } = data;
  const { pm_id: pmId, pid, name, monit, pm2_env } = app as IApp;
  const { restart_time: restarts, unstable_restarts: unstableRestarts, pm_uptime: uptime, status, exec_mode: execMode } = pm2_env;
  const { cpu, memory } = monit;
  const isOnline = status === AppStatus.ONLINE || status === AppStatus.LAUNCHING || status === AppStatus.ONE_LAUNCH;

  return (
    <Layout>
      <div className="container panel is-info">
        <div className="panel-heading">
          {id}
          <a 
            className={`button button-primary is-pulled-right is-light is-outlined ${canUpdate ? '' : 'is-loading'}`} 
            style={{ marginTop: '-6px' }} 
            onClick={null}>
            Update
          </a>
        </div>
        <div className="panel-block is-block" style={{ width: '100%' }}>
          <div className="columns">
            <style>{'.is-inline-flex > button { flex: 1; }'}</style>
            <div className="column is-12 buttons is-inline-flex">
              <StartButton status={status} onClick={null} />
              <RestartButton status={status} onClick={null} />
              <DeleteButton status={status} onClick={null} />
            </div>
          </div>
          {/*<div className="columns">
            <div className="column is-4 has-text-centered">
              <p className="subtitle">{(memory / bytesInMb).toFixed(2)}mb</p>
            </div>
            <div className="column is-4 has-text-centered">
              <p className="subtitle">{cpu}%</p>
            </div>
          </div>*/}
        </div>
      </div>

      <div className="container box">
        <style>{`
          tr { display: flex; }
          tr > th, td { flex: 1; text-align: center!important; }
          .is-online > th { border-color: #48c774!important; }
          .is-offline > th { border-color: #f14668!important; }
        `}</style>
        <table className="table status-table is-fullwidth is-centered">
          <thead>
            <tr className={`is-size-5 ${isOnline ? 'is-online' : 'is-offline'}`}>
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
      </div>
    </Layout>
  );
}));