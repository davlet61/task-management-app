import type { NextPage } from 'next';
import Sidebar from '@components/Sidebar';
import Todos from '@components/Todos';

const Home: NextPage = () => (
  <main>
    <Sidebar />
    <Todos />
  </main>
);

export default Home;
