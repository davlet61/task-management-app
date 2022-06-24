import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { NavigationType } from '@lib/navigation';
import { Routes } from 'types';
import { CollectionItems } from './SVGs';

interface INavbarProps {
  navigationData: NavigationType;
}

const Navbar = ({ navigationData }: INavbarProps) => {
  const { pathname } = useRouter();
  return (
    <nav className="navbar">
      <NextLink href="/">
        <span className="logo">
          <CollectionItems />
        </span>
      </NextLink>
      <ul className="navItems">
        {navigationData.map((route: Routes) => (

          <li
            key={uuid()}
            className={`navItem ${pathname === route.path && 'selectedNavItem'}`}
          >
            <NextLink
              href={route.path}
              passHref
            >
              {route.title}
            </NextLink>
          </li>

        ))}
      </ul>
      <button type="button" className="actions">Logout</button>
    </nav>
  );
};

export default Navbar;
