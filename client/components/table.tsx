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

export function ApplicationRow({ pid, name, status, uptime, restarts, unstableRestarts, memory, cpu }) {
  return <tr>
    <td>{pid}</td>
    <td>{name}</td>
    <td>{statusIcon[status]()}{status}</td>
    <td>{uptime}</td>
    <td>
      {restarts}
      {unstableRestarts > 0 ? [' + ', <b key='unstable-restarts' className="has-text-danger">{unstableRestarts}</b>] : null}
    </td>
    <td>{memory}mb</td>
    <td>{cpu}%</td>
  </tr>;
};

export function ApplicationsTable() {
  const statuses = Object.keys(statusIcon);
  const rows = statuses.map((status, index) => <ApplicationRow key={`ph_row_${index}`} pid={index} name={`app_${index}`} status={status} uptime="1 day" restarts={index} unstableRestarts={Math.max(index - 3, 0)} memory={index * 23} cpu={index * 1.65} />);
  return <table className="table is-fullwidth is-bordered is-striped is-hoverable">
    <TableHead columns={['pid', 'name', 'status', 'uptime', 'restarts', 'memory', 'cpu']} />
    <tbody>
      {rows}
    </tbody>
  </table>;
};