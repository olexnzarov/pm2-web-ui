import { withRedux } from '../client/middlewares/redux';
import { withAuth } from '../client/middlewares/auth'; 
import { useSelector } from 'react-redux';
import { IGlobalState } from '../client/store';
import useSWR from 'swr';
import { fetcher } from '../client/util';
import { IAppOwnership, UserAppRight } from '../shared/user';

import Layout from '../client/components/Layout';
import Icon from '../client/components/Icon';
import TableHead from '../client/components/TableHead';
import ErrorDisplay from '../client/components/ErrorDisplay';

function AdminInfoPanel() {
  return (
    <div className="is-block" style={{ padding: '10px' }}>
      <p>You are an admin and have full access to the dashboard. These are the things you can do:</p>
      <div className="content is-small">
        <ul>
          <li>View, manage and interact with all applications.</li>
          <li>Deploy new applications.</li>
          <li>Create and manage other users.</li>
        </ul>
      </div>
    </div>
  );
}

const permissions = [UserAppRight.VIEW, UserAppRight.MANAGE, UserAppRight.INTERACT, UserAppRight.DELETE]
function AppRow(props) {
  const app = props.app as IAppOwnership;
  return (
    <tr>
      <td>{app.id}</td>
      {
        permissions.map(p => {
          const has = (app.right & p) === p;
          return (
            <td key={p}>
              <Icon style={{ display: 'inline' }} className={`has-text-${has ? 'success' : 'danger'}`} icon={has ? 'fa-check' : 'fa-times'} />
            </td>
          );
        })
      }
    </tr>
  );
}

function AppsList(props) {
  const apps = props.apps as IAppOwnership[];

  if (!apps) { return <progress className="progress is-small is-link" max="100">Loading...</progress>; }

  if (apps.length === 0) {
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        <p style={{ margin: '10px' }}>You do not have access to any application.</p>
      </div>
    );
  }

  return (
    <div className="table-container" style={{ width: '100%' }}>
      <style>{`tr > th, td { text-align: center!important; }`}</style>
      <table className="table is-fullwidth is-bordered is-striped is-hoverable" style={{ textAlign: 'center', tableLayout: 'auto' }}>
        <TableHead columns={['application', 'view', 'manage', 'interact', 'delete']} />
        <tbody>
          {apps.map(a => <AppRow key={a.id} app={a} />)}
        </tbody>
      </table>
    </div>
  );
}

export default withRedux(withAuth(function() {
  const client = useSelector((state: IGlobalState) => state.client);
  const { data, error } = useSWR('/api/me', fetcher);

  return (
    <Layout>
      <div className="container panel is-link">
        <div className="panel-heading">
          {client.username}{client.isAdmin && <Icon icon='fa-user-shield' style={{ marginLeft: '10px', display: 'inline' }} />}
        </div>
        <div className="panel-block" style={{ width: '100%' }}>
          {
            error ? <ErrorDisplay style={{ width: '100%' }} title={error.response?.statusText ?? 'Error'} text={error.response?.data?.message ?? error.toString()} /> : 
            <>
              {
                client.isAdmin
                ? <AdminInfoPanel />
                : <AppsList apps={data?.user.apps} />
              }
            </>
          }
        </div>
      </div>
    </Layout>
  );
}));