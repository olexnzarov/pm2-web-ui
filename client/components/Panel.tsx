export default function({ title, children = null, onUpdate = null, canUpdate = false }) {
  return (
    <div className="container panel is-info">
      <div className="panel-heading">
        {title}
        <a 
          className={`button button-primary is-pulled-right is-light is-outlined ${canUpdate ? '' : 'is-loading'}`} 
          style={{ marginTop: '-6px' }} 
          onClick={() => canUpdate && onUpdate()}>
          Update
        </a>
      </div>
      <div className="panel-block" style={{ width: '100%' }}>
        {children}
      </div>
    </div>
  );
}