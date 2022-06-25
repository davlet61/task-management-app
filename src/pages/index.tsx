import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';
import Layout from '@components/Layout';

const Home: NextPage = () => (
  <Layout>
    <main className="h-[calc(100vh-5rem)]">
      <Sidebar />
      <Todos />
    </main>
  </Layout>
);

export default Home;
