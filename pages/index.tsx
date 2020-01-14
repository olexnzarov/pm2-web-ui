import { withRedux } from '../client/middlewares/redux';
import { withAuth } from '../client/middlewares/auth'; 
import useSWR from 'swr';
import { fetcher } from '../client/util';

import ApplicationsTable from '../client/components/ApplicationsTable';
import Layout from '../client/components/Layout';

export default withRedux(withAuth(function() {
  const { data, error, isValidating, revalidate } = useSWR('/api/apps', fetcher, { refreshInterval: 8000 });
  const canUpdate = !isValidating && (data || error);

  return (
    <Layout>
      <div className="container panel is-info">
        <div className="panel-heading">
          Applications
          <a 
            className={`button button-primary is-pulled-right is-light is-outlined ${canUpdate ? '' : 'is-loading'}`} 
            style={{ marginTop: '-6px' }} 
            onClick={() => canUpdate && revalidate()}>
            Update
          </a>
        </div>
        <div className="panel-block" style={{ width: '100%' }}>
          <ApplicationsTable isLoading={!data} apps={data ? data.apps : null} error={error ?? null} />
        </div>
      </div>
    </Layout>
  );
}));