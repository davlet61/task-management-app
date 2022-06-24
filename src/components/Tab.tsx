/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  HomeFilled, InboxInSolid, UserSolid,
} from './SVGs';

interface ITabbarProps {
  navigationData: string[];
}

const Tabbar = ({ navigationData }: ITabbarProps) => {
  const { pathname } = useRouter();

  const getTabIcon = useCallback((item: string) => {
    switch (item) {
      case 'Home':
        return <HomeFilled />;
      case 'Inbox':
        return <InboxInSolid />;
      case 'Profile':
        return <UserSolid />;

      default:
        return <HomeFilled />;
    }
  }, []);

  return (
    <nav className="tabbar">
      {navigationData.map((item: string) => (
        <li
          key={uuid()}
          className={`tabItem ${pathname === item && 'tabItemActive'}`}
        >
          <NextLink href={`/${item}`} passHref>
            <span className="icon">{getTabIcon(item)}</span>
          </NextLink>
        </li>
      ))}
    </nav>
  );
};

export default Tabbar;
