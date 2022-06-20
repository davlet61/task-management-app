import useStore from 'store';
import { Task, HandleDelAndStatusFn } from '../types';

const TodoItem = ({ todo }: { todo: Task }) => {
  const store = useStore((state) => state);

  const handleCompleted: HandleDelAndStatusFn = (id) => {
    store.markComplete(id);
  };

  const handleDelete: HandleDelAndStatusFn = (id) => {
    store.deleteTodo(id);
  };

  return (
    <article
      data-testid="toggleComplete"
      className={`todo todo--toggle-completed ${todo.completed ? 'todo--completed' : ''
        }`}
      onClick={(e) => handleCompleted(todo.id)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(todo.id);
        }}
        className="todo__button--remove"
        data-testid="removeBtn"
      >
        Delete
      </button>
      <h3 className="todo__title">{todo.title}</h3>
      <p className="todo__desc">{todo.description}</p>
    </article>
  );
};

export default TodoItem;
