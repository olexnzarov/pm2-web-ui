import Link from 'next/link';

export function Input(props) {
  const { name, icon, invalid, invalidMessage, ...rest } = props;
  return <div className="field">
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
  </div>;
};

export function LoginButton(props) {
  const { logout, isLoading } = props;
  return <Link href={logout ? '/logout' : '/login'}>
    <a className={`button is-link ${isLoading ? 'is-loading is-disabled' : ''}`}>
      <strong>{logout ? 'Log out' : 'Log in'}</strong>
    </a>
  </Link>;
};