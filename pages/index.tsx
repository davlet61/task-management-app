import type { NextPage } from 'next';
import useStore from 'store';
import AddTodo from '@components/AddTodo';
import Popup from '@components/Popup';
import TodoList from '@components/TodoList';
import AddProject from '@components/AddProject';

const Home: NextPage = () => {
  const { todos } = useStore((state) => state);

  return (
    <div
      style={{ minWidth: 250, maxWidth: 600, margin: 'auto' }}
      className="w-full h-full flex flex-col justify-center items-center p-4"
    >
      <AddProject />
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
  );
};

export default Home;
