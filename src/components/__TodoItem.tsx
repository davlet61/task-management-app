import useStore from '@store/.';
import { Task } from '../types';

interface ITodoItemProps {
  todo: Task;
}
const TodoItem = ({ todo }: ITodoItemProps) => {
  const store = useStore((state) => state);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <article
      data-testid="toggleComplete"
      className="flex justify-center ml-60 gap-4"
      onClick={() => store.markComplete(todo.id)}
      onKeyDown={(e) => {
        if (e.key === 'Spacebar') {
          store.markComplete(todo.id);
        }
      }}
    >
      <h3>{todo.title}</h3>
      <p>{todo.description}</p>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          store.deleteTodo(todo.id);
        }}
        data-testid="removeBtn"
      >
        Delete
      </button>
    </article>
  );
};

export default TodoItem;
