import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { CollectionItems } from './SVGs';

interface INavbarProps {
  navigationData: string[];
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
        {navigationData.map((item: string) => (

          <li
            key={uuid()}
            className={`navItem ${pathname === item && 'selectedNavItem'}`}
          >
            <NextLink
              href={`/${item}`}
              passHref
            >
              {item}
            </NextLink>
          </li>

        ))}
      </ul>
      <button type="button" className="actions">Logout</button>
    </nav>
  );
};

export default Navbar;
