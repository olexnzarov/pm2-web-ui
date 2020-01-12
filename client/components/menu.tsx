export function MenuLabel(props) {
  return <p className="menu-label">
    {props.children}
  </p>;
};

export function SideMenu() {
  return <div>
    <aside className="menu">
      <p className="menu-label">
        General
      </p>
      <ul className="menu-list">
        <li><a>Dashboard</a></li>
        <li><a>Applications</a></li>
      </ul>
      <p className="menu-label">
        Administration
      </p>
      <ul className="menu-list">
        <li><a>Users</a></li>
        <li><a>Logs</a></li>
      </ul>
      <p className="menu-label">
        Profile
      </p>
      <ul className="menu-list">
        <li><a>Information</a></li>
        <li><a>Logout</a></li>
      </ul>
    </aside>
  </div>;
};