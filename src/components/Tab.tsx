/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Routes } from 'types';
import { NavigationType } from '@lib/navigation';
import {
  HomeFilled, InboxInSolid, UserSolid,
} from './SVGs';

interface ITabbarProps {
  navigationData: NavigationType;
}

const Tabbar = ({ navigationData }: ITabbarProps) => {
  const { pathname } = useRouter();

  const getTabIcon = useCallback((title: string) => {
    switch (title) {
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
    <nav className="tabbar z-20">
      {navigationData.map((route: Routes) => (
        <li
          key={uuid()}
          className={`tabItem ${pathname === route.title && 'tabItemActive'}`}
        >
          <NextLink href={route.path} passHref>
            <span className="icon">{getTabIcon(route.title)}</span>
          </NextLink>
        </li>
      ))}
    </nav>
  );
};

export default Tabbar;
