const unknownState = {
  disabled: true,
  text: '...',
  icon: 'fa-bug',
  color: 'is-danger',
};

export default function({ traits, status, loading = false, ...props }) {
  const { disabled, text, icon, color } = traits[status] || unknownState;

  return <button className={`button ${color} ${loading ? 'is-loading' : ''}`} disabled={disabled || loading} {...props}>
    <span className="icon is-small">
      <i className={`fas ${icon}`}></i>
    </span>
    <span>{text}</span>
  </button>;
};