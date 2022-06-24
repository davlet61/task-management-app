import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';
import Layout from '@components/Layout';

const Home: NextPage = () => (
  <Layout>
    <main>
      <Sidebar />
      <Todos />
    </main>
  </Layout>
);

export default Home;
