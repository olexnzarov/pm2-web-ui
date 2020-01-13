import moment from 'moment';
import Router from 'next/router';

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

function TableCell({ children, ...props }) {
  return <td 
    {...props}
  >{children}</td>;
};

const getTextContent = (children) => {
  let text = '';

  if (!Array.isArray(children)) { children = [children]; }

  for (let i = 0; i < children.length; i++) {
    const c = children[i];
    if (c === undefined || c === null) { continue; }
    if (Array.isArray(c)) { text += getTextContent(c); }
    if (typeof(c) === 'object') { text += getTextContent(c.props?.children); continue; }

    text += c;
  };

  return text;
};

const functionalCell = (pid) => {
  return function({ children, ...props }) {
    const attr = {
      onClick: () => Router.push(`/app/${pid}`),
      onContextMenu: (e) => {
        const textToCopy = getTextContent(children);
        e.preventDefault();
        navigator.clipboard.writeText(textToCopy).catch(console.log);
      },
      style: { cursor: 'pointer' },
    };

    return <TableCell {...attr} {...props}>{children}</TableCell>;
  };
};

const bytesInMb = 1024**2;
export function ApplicationRow({ app, isLast = false }) {
  const { pid, name, monit, pm2_env } = app;
  const { memory, cpu } = monit;
  const { pm_id: id, restart_time: restarts, unstable_restarts: unstableRestarts, pm_uptime: uptime, status, exec_mode: execMode } = pm2_env;
  const icon = statusIcon[status] ? statusIcon[status]() : null;

  const mup = moment(uptime);
  const Td = functionalCell(id);
  const details = `${name}\npid: ${pid}\nmode: ${execMode}`;
  return <tr>
    <Td>{id}</Td>
    <Td className={`has-tooltip-${isLast ? 'top' : 'right'}`} data-tooltip={details}>{name}</Td>
    <Td>{icon}{status}</Td>
    <Td data-tooltip={mup.calendar()}>{mup.fromNow(true)}</Td>
    <Td>
      {restarts}
      {
        unstableRestarts > 0 ? [
          ' + ', 
          <b key='unstable-restarts' className="has-text-danger has-tooltip-danger" data-tooltip={`this application had ${unstableRestarts} unstable restart${unstableRestarts != 1 ? 's' : ''}`}>
            {unstableRestarts}
          </b>
        ] : null
      }
    </Td>
    <Td>{(memory / bytesInMb).toFixed(2)}mb</Td>
    <Td>{cpu}%</Td>
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

  const rows = apps.map((app, index) => <ApplicationRow key={`app_row_${app.pid}`} app={app} isLast={index === apps.length - 1}/>);
  return <div className="table-container" style={{ width: '100%' }}>
    <table className="table is-fullwidth is-bordered is-striped is-hoverable">
      <TableHead columns={['id', 'name', 'status', 'uptime', 'restarts', 'memory', 'cpu']} />
      <tbody>
        {rows}
      </tbody>
    </table>
  </div>;
};