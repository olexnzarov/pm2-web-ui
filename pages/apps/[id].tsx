import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import useSWR from 'swr';
import { fetcher } from '../../client/util';
import { withRedux } from '../../client/middlewares/redux';
import { withAuth } from '../../client/middlewares/auth'; 
import axios from 'axios';

import Layout from '../../client/components/Layout';
import StartButton from '../../client/components/apps/StartButton';
import RestartButton from '../../client/components/apps/RestartButton';
import DeleteButton from '../../client/components/apps/DeleteButton';
import Panel from '../../client/components/Panel';
import ErrorDisplay from '../../client/components/ErrorDisplay';
import { IApp, AppStatus, ExecMode, IAppInstance } from '../../shared/pm2';
import { AppAction } from '../../shared/actions';
import ReloadButton from '../../client/components/apps/ReloadButton';
import ClusterIcon from '../../client/components/ClusterIcon';

function DataRow({ name, value }) {
  return <tr>
    <td style={{ textAlign: 'center' }}><b>{name}</b></td>
    <td style={{ textAlign: 'center', width: '100%' }}>{value}</td>
  </tr>;
}

function MonitoringPanel(props) {
  const apps = props.apps as IAppInstance[];
  return (
    <div className="container">
      <style>{`
        tr { display: flex; }
        tr > th, td { flex: 1; text-align: center!important; }
        .is-online > th { border-color: #48c774!important; }
        .is-offline > th { border-color: #f14668!important; }
      `}</style>
      {
        apps.map(({ pid, monit: { cpu, memory }, pm2_env: { status } }) =>
          <div key={pid} className="box">
            <b>pid: {pid}</b>
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
          </div>
        )
      }
    </div>
  );
};

const bytesInMb = 1024**2;
export default withRedux(withAuth(function() {
  const isMounted = useRef(true);

  const [isWaiting, setWaiting] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  const { data, error, isValidating, revalidate } = useSWR(`/api/apps/${id}`, fetcher, { refreshInterval: 3000 });
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
  const { pm_id: pmId, name, exec_mode: execMode, instances } = app as IApp;
  const status = instances[0]?.pm2_env.status;
  const isOnline = status === AppStatus.ONLINE || status === AppStatus.LAUNCHING || status === AppStatus.ONE_LAUNCH;
  const isCluster = execMode === ExecMode.CLUSTER;

  const buttonProps: any = { status };
  if (isWaiting) { buttonProps.loading = true; }

  const sendAction = async (action: AppAction) => {
    setWaiting(true);

    await axios.post(`/api/apps/${id}`, { action, id: name });
    await revalidate();

    if (isMounted) { setWaiting(false); }
  };

  return (
    <Layout>
      <div className="container panel is-info">
        <div className="panel-heading">
          {id}{isCluster && <ClusterIcon pull={null} />}
          <a 
            className={`button button-primary is-pulled-right is-light is-outlined ${canUpdate ? '' : 'is-loading'}`} 
            style={{ marginTop: '-6px' }} 
            onClick={() => revalidate()}>
            Update
          </a>
        </div>
        <div className="panel-block is-block" style={{ width: '100%' }}>
          <div className="columns">
            <style>{'.is-inline-flex > button { flex: 1; }'}</style>
            <div className="column is-12 buttons is-inline-flex">
              <StartButton {...buttonProps} onClick={() => sendAction(isOnline ? AppAction.STOP : AppAction.START)} />
              {
                isCluster &&
                <ReloadButton {...buttonProps} onClick={() => sendAction(AppAction.RELOAD)} />
              }
              <RestartButton {...buttonProps} onClick={() => sendAction(AppAction.RESTART)} />
              <DeleteButton {...buttonProps} onClick={() => sendAction(AppAction.DELETE)} />
            </div>
          </div>
        </div>
      </div>

      <MonitoringPanel apps={instances} />
    </Layout>
  );
}));