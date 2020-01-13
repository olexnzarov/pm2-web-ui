import moment from 'moment';

export function TableHead({ columns }) {
  const elements = columns.map(col => <th key={col}>{col}</th>);
  return <thead><tr>{elements}</tr></thead>;
};

const statusIcon = {
  online: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-play has-text-success"></i></span>,
  stopping: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-stop-circle"></i></span>,
  stopped: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-stop"></i></span>,
  launching: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-rocket has-text-primary"></i></span>,
  errored: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-exclamation-triangle has-text-danger"></i></span>,
  ['one-launch-status']: () => <span className="icon is-pulled-right" style={{ marginLeft: '10px' }}><i className="fas fa-asterisk"></i></span>,
};

const bytesInMb = 1024**2;
export function ApplicationRow({ app }) {
  const { pid, name, monit, pm2_env } = app;
  const { memory, cpu } = monit;
  const { restart_time: restarts, unstable_restarts: unstableRestarts, pm_uptime: uptime, status } = pm2_env;
  const icon = statusIcon[status] ? statusIcon[status]() : null;

  return <tr>
    <td>{pid}</td>
    <td>{name}</td>
    <td>{icon}{status}</td>
    <td>{moment(uptime).fromNow(true)}</td>
    <td>
      {restarts}
      {unstableRestarts > 0 ? [' + ', <b key='unstable-restarts' className="has-text-danger">{unstableRestarts}</b>] : null}
    </td>
    <td>{(memory / bytesInMb).toFixed(2)}mb</td>
    <td>{cpu}%</td>
  </tr>;
};

function LoadingBar() {
  return <progress className="progress is-small is-info" max="100">Loading...</progress>;
}

function EmptyTable() {
  return <div style={{ textAlign: 'center', width: '100%', padding: '10px' }}>
    <p className="subtitle">There are no applications.</p>
  </div>;
}

function ErrorDisplay({ title, text, onRemove = null, ...props }) {
  return <article className="message is-danger" {...props}>
    <div className="message-header">
      <p>{title}</p>
      {
        onRemove &&
        <button className="delete" aria-label="delete" onClick={() => onRemove()}></button>
      }
    </div>
    <div className="message-body">
      {text}
    </div>
  </article>;
}

export function ApplicationsTable(props) {
  const { apps = [], isLoading = false, error = null } = props;

  if (error) {
    const title = error.response?.statusText ?? 'Error';
    const text = error.response?.data?.message ?? error.toString();

    return <ErrorDisplay title={title} text={text} style={{ width: '100%' }} />;
  }

  if (isLoading) { return <LoadingBar />; }
  if (apps.length === 0) { return <EmptyTable />; }

  const rows = apps.map((app) => <ApplicationRow key={`app_row_${app.pid}`} app={app} />);
  return <div className="table-container" style={{ width: '100%' }}>
    <table className="table is-fullwidth is-bordered is-striped is-hoverable">
      <TableHead columns={['pid', 'name', 'status', 'uptime', 'restarts', 'memory', 'cpu']} />
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>;
};