import type { NextPage } from 'next';
import useStore from '@store/.';
import AddTodo from '@components/AddTodo';
import Popup from '@components/Popup';
import Sidebar from '@components/Sidebar';
import TodoList from '@components/TodoList';

const Home: NextPage = () => {
  const { todos } = useStore((state) => state);

  return (
    <main>
      <Sidebar />
      <AddTodo />
      <TodoList />
      <Popup>
        <h2>Are you sure you want to delete the list?</h2>
        <h1>THIS ACTION IS IRREVERSIBLE!</h1>
      </Popup>
      <button
        type="button"
        className="button"
        disabled={todos.length === 0}
      >
        Clear list
      </button>
    </main>
  );
};

export default Home;
