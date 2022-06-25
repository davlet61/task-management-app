/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Routes } from 'types';
import { NavigationType } from '@lib/navigation';
import useVisibility from '@hooks/useVisibility';

import {
  MenuButton, HomeFilled, InboxInSolid, UserSolid,
} from './SVGs';

interface ITabbarProps {
  navigationData: NavigationType;
}

const Tabbar = ({ navigationData }: ITabbarProps) => {
  const { visibility, setVisibility } = useVisibility();
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

  const handleClickOrEnter = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') {
      setVisibility(false);
    }
    setVisibility(true);
  };

  return (
    <nav className="tabbar z-20">
      {navigationData.map((route: Routes) => (
        <li
          key={uuid()}
          className={`tabItem ${pathname === route.title && 'tabItemActive'}`}
        >
          <div
            role="link"
            tabIndex={0}
            onClick={handleClickOrEnter}
            onKeyDown={handleClickOrEnter}
          >
            <NextLink
              href={route.path}
              passHref
            >
              <span className="icon">{getTabIcon(route.title)}</span>
            </NextLink>
          </div>
        </li>
      ))}
      <li className="tabItem">
        <button aria-label="button" type="button" className="icon" onClick={() => setVisibility(!visibility)}><MenuButton /></button>
      </li>
    </nav>
  );
};

export default Tabbar;
