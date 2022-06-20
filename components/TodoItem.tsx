import useStore from 'store';
import { Task } from '../types';

interface ITodoItemProps {
  todo: Task;
}
const TodoItem = ({ todo }: ITodoItemProps) => {
  const store = useStore((state) => state);

  return (
    <article
      data-testid="toggleComplete"
      className={`todo todo--toggle-completed ${todo.completed ? 'todo--completed' : ''
        }`}
      onClick={() => store.markComplete(todo.id)}
      onKeyDown={(e) => {
        if (e.key === 'Spacebar') {
          store.markComplete(todo.id);
        }
      }}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          store.deleteTodo(todo.id);
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
