import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';
import Layout from '@components/Layout';

const Home: NextPage = () => (
  <Layout>
    <Sidebar />
    <Todos />
  </Layout>
);

export default Home;
