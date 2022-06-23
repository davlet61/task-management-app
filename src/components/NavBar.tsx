import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { NavigationType, matchRoute } from '@lib/navigation';
import { Routes } from 'types';
import { CollectionItems, UserSolid } from './SVGs';

interface INavbarProps {
  navigationData: NavigationType;
}

const Navbar = ({ navigationData }: INavbarProps) => {
  const { pathname, push, query } = useRouter();

  const handleClick = () => {
    push('/profile');
  };

  return (
    <nav className="navbar">
      <NextLink href="/">
        <span className="logo">
          <CollectionItems />
        </span>
      </NextLink>
      <ul className="nav-items">
        {navigationData.map((route: Routes) => (
          <li
            key={uuid()}
            className={`nav-item ${matchRoute(route, pathname, query) && 'selected-nav-item'}`}
          >
            <NextLink href={route.path}>
              {route.title}
            </NextLink>
          </li>

        ))}
      </ul>
      <UserSolid w={8} h={8} click={handleClick} />
    </nav>
  );
};

export default Navbar;
