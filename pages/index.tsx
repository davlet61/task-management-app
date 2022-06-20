import type { NextPage } from 'next';
import useStore from 'store';
import AddTodo from '@components/AddTodo';
import Popup from '@components/Popup';
import TodoList from '@components/TodoList';

const Home: NextPage = () => {
  const { todos } = useStore((state) => state);

  return (
    <>
      <h1 className="container__title">Things I have to do...</h1>
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
    </>
  );
};

export default Home;
