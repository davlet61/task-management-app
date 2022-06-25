import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';
import Layout from '@components/Layout';
import WhoIsHere from '@components/WhoIsHere';

const Home: NextPage = () => (
  <Layout>
    <WhoIsHere />
    <Sidebar />
    <Todos />
  </Layout>
);

export default Home;
