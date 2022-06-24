/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import {
  HomeFilled, InboxInSolid, UserSolid,
} from './SVGs';

const Tabbar = ({ navigationData, currentRoute, setCurrentRoute }: any) => {
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
        <span
          key={uuid()}
          className={`tabItem ${currentRoute === item && 'tabItemActive'}`}
          onClick={() => setCurrentRoute(item)}
          onKeyDown={() => setCurrentRoute(item)}
        >
          <span className="icon">{getTabIcon(item)}</span>
        </span>
      ))}
    </nav>
  );
};

export default Tabbar;
