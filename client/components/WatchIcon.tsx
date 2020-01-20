import Icon from "./Icon";

export default function({ pull = 'right', ...props }) {
  return <Icon className={pull ? `is-pulled-${pull}` : ''} icon="fa-eye" style={{ marginLeft: '10px', display: 'inline' }} {...props} />;
}