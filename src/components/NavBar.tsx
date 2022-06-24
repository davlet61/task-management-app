/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { v4 as uuid } from 'uuid';
import { CollectionItems } from './SVGs';

const Navbar = ({ navigationData, currentRoute, setCurrentRoute }: any) => (
  <nav className="navbar">
    <span className="logo">
      <CollectionItems />
    </span>
    <ul className="navItems">
      {navigationData.map((item: string) => (
        <li
          className={`navItem ${currentRoute === item && 'selectedNavItem'}`}
          key={uuid()}
          onClick={() => setCurrentRoute(item)}
          onKeyDown={() => setCurrentRoute(item)}
        >
          {item}
        </li>
      ))}
    </ul>
    <button type="button" className="actions">Logout</button>
  </nav>
);

export default Navbar;
