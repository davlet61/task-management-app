import type { NextPage } from 'next';
import useStore from 'store';
import AddTodo from '@components/AddTodo';
import Popup from '@components/Popup';
import TodoList from '@components/TodoList';
import Sidebar from '@components/Sidebar';

const Home: NextPage = () => {
  const { todos } = useStore((state) => state);

  return (
    <main>
      <Sidebar />
      <div
        style={{ minWidth: 250, maxWidth: 600, margin: 'auto' }}
        className="w-full h-full flex flex-col justify-center items-center p-4"
      >
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
      </div>
    </main>
  );
};

export default Home;
