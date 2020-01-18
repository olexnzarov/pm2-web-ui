export default function({ pull = 'right', ...props }) {
  return (
    <span className={`icon ${pull ? `is-pulled-${pull}` : ''}`} style={{ marginLeft: '10px' }} {...props}>
      <i className="fas fa-layer-group"></i>
    </span>
  );
}