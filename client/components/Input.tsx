export default function(props) {
  const { name, icon, invalid, invalidMessage, ...rest } = props;
  return (
    <div className="field">
      <label className="label">{name}</label>
      <div className="control has-icons-left has-icons-right">
        <input className={`input ${invalid ? 'is-danger' : ''}`} {...rest}/>
        {
          icon &&
          <span className="icon is-small is-left">
            <i className={`fas ${icon}`}></i>
          </span>
        }
        {
          invalid &&
          <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle"></i>
          </span>
        }
      </div>
      {
        (invalid && invalidMessage) &&
        <p className="help is-danger">{invalidMessage}</p>
      }
    </div>
  );
};
