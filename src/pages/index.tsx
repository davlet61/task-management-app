import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';
import Layout from '@components/Layout';
import WhoIsHere from '@components/WhoIsHere';

const Home: NextPage = () => (
  <Layout>
    <main className="h-[calc(100vh-5rem)]">
      <WhoIsHere />
      <Sidebar />
      <Todos />
    </main>
  </Layout>
);

export default Home;
