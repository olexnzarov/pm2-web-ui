import { ApplicationsTable } from '../client/components/table';
import { Navbar } from '../client/components/navbar';
import { withRedux } from '../client/middleware/redux';
import { withAuth } from '../client/middleware/auth'; 

export default withRedux(withAuth(function() {
  return <div>
    <Navbar/>
    <section className="section">
      <div className="container panel is-info">
        <div className="panel-heading">
          Applications
          <a className="button button-primary is-pulled-right is-light is-outlined" style={{ marginTop: '-6px' }}>Update</a>
        </div>
        <div className="panel-block" style={{ width: '100%' }}>
          <ApplicationsTable />
        </div>
      </div>
    </section>
  </div>
}));