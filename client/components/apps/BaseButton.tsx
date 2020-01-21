import Icon from "../Icon";

const unknownState = {
  disabled: true,
  text: '...',
  icon: 'fa-bug',
  color: 'is-danger',
};

export default function({ traits, status, disabled: shouldBeDisabled, loading = false, ...props }) {
  const { disabled, text, icon, color } = traits[status] || unknownState;

  return <button className={`button ${color} ${loading ? 'is-loading' : ''}`} disabled={disabled || loading || shouldBeDisabled} {...props}>
    <Icon className="is-small" icon={icon} />
    <span>{text}</span>
  </button>;
};