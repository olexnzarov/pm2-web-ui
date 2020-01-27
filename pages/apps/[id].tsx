import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
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
import { IApp, AppStatus, ExecMode } from '../../shared/pm2';
import { AppAction } from '../../shared/actions';
import ReloadButton from '../../client/components/apps/ReloadButton';
import ClusterIcon from '../../client/components/ClusterIcon';
import InstancesList from '../../client/components/apps/InstancesList';
import { IGlobalState } from '../../client/store';
import { UserAppRight } from '../../shared/user';

export default withRedux(withAuth(function() {
  const isMounted = useRef(true);
  const client = useSelector((state: IGlobalState) => state.client);
  const [isWaiting, setWaiting] = useState(false);
  const [warning, setWarning] = useState(null);
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

  const appRights = client.apps.find(a => a.id === id)?.right ?? 0;
  const canManage = client.isAdmin || (appRights & UserAppRight.MANAGE) === UserAppRight.MANAGE;
  const canDelete = client.isAdmin || (appRights & UserAppRight.DELETE) === UserAppRight.DELETE;

  const { app } = data;
  const { pm_id: pmId, name, exec_mode: execMode, instances } = app as IApp;
  const status = instances[0]?.pm2_env.status;
  const isOnline = status === AppStatus.ONLINE || status === AppStatus.LAUNCHING || status === AppStatus.ONE_LAUNCH;
  const isCluster = execMode === ExecMode.CLUSTER;

  const buttonProps: any = { status };
  if (isWaiting) { buttonProps.loading = true; }

  const sendAction = async (action: AppAction) => {
    setWaiting(true);
    setWarning(null);

    try { await axios.post(`/api/apps/${name}`, { action }); }
    catch (err) {
      if (isMounted) { 
        setWarning([err.response?.statusText ?? 'Error', err.response?.data?.message ?? err.toString()]); 
      }
    }
    
    if (isMounted) { 
      await revalidate();
      setWaiting(false); 
    }
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
        <div className="panel-block is-block">
          <style>{'.is-inline-flex > button { flex: 1; }'}</style>
          <div className="buttons is-inline-flex" style={{ width: '100%' }}>
            <StartButton {...buttonProps} disabled={!canManage} onClick={() => sendAction(isOnline ? AppAction.STOP : AppAction.START)} />
            {
              isCluster &&
              <ReloadButton {...buttonProps} disabled={!canManage} onClick={() => sendAction(AppAction.RELOAD)} />
            }
            <RestartButton {...buttonProps} disabled={!canManage} onClick={() => sendAction(AppAction.RESTART)} />
            <DeleteButton {...buttonProps} disabled={!canDelete} onClick={() => sendAction(AppAction.DELETE)} />

            {
              warning &&
              <ErrorDisplay color='is-warning' style={{ width: '100%', marginBottom: '10px' }} title={warning[0]} text={warning[1]} />
            }
          </div>
        </div>
      </div>

      <InstancesList apps={instances} />
    </Layout>
  );
}));