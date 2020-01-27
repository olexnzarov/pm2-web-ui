import Link from 'next/link';

export default function LoginButton(props) {
  const { logout, isLoading } = props;
  return (
    <Link href={logout ? '/logout' : '/login'}>
      <a className={`button is-link ${isLoading ? 'is-loading is-disabled' : ''}`}>
        <strong>{logout ? 'Log out' : 'Log in'}</strong>
      </a>
    </Link>
  );
};