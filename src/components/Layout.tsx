import NavBar from '@components/NavBar';
import Meta from '@components/Meta';
import Footer from '@components/Footer';
import navigationData from '@lib/navigation';
import Tabbar from './Tab';

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
}: LayoutProps) => (
  <>
    <Meta title={title} keywords={keywords} description={description} />
    <NavBar
      navigationData={navigationData}
    />
    <Tabbar
      navigationData={navigationData}
    />
    {children}
    <Footer />
  </>
);

export default Layout;

Layout.defaultProps = {
  title: 'Task Management',
  keywords: 'web development, programming, nextjs, prisma, trpc',
  description: 'A task management app built with modern tools.',
};
