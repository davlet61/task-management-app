import NavBar from '@components/NavBar';
import Meta from '@components/Meta';
import Footer from '@components/Footer';
import navigationData from '@lib/navigation';
import { useMyPresence } from '@liveblocks/react';
import { Presence } from 'types';
import Tabbar from './Tab';
import UserCursor from './UserCursor';

interface LayoutProps {
  children: React.ReactNode;
  title?: string,
  keywords?: string,
  description?: string,
}

const Layout = ({
  children,
  title,
  keywords,
  description,
}: LayoutProps) => {
  const [{ cursor }, updateMyPresence] = useMyPresence<Presence>();
  return (
    <>
      <Meta title={title} keywords={keywords} description={description} />
      <NavBar
        navigationData={navigationData}
      />
      <Tabbar
        navigationData={navigationData}
      />
      <main
        className="h-[calc(100vh-5rem)]"
        onPointerMove={(event) => updateMyPresence({
          cursor: {
            x: Math.round(event.clientX),
            y: Math.round(event.clientY),
          },
        })}
        onPointerLeave={() => updateMyPresence({
          cursor: null,
        })}
      >
        {children}
      </main>
      <UserCursor cursor={cursor} />
      <Footer />
    </>
  );
};

export default Layout;

Layout.defaultProps = {
  title: 'Task Management',
  keywords: 'web development, programming, nextjs, prisma, trpc',
  description: 'A task management app built with modern tools.',
};