import { Task, HandleDelAndStatusFn } from '../types';
import { useAppDispatch } from '../../redux/hooks/typedHooks';
import { markComplete, deleteTodo } from '../../redux/slice/todosSlice';

const TodoItem = ({ todo }: { todo: Task }) => {
  const dispatch = useAppDispatch();

  dispatch(markComplete(id));
  const handleCompleted: HandleDelAndStatusFn = (id) => {
  };

  const handleDelete: HandleDelAndStatusFn = (id) => {
    dispatch(deleteTodo(id));
  };

  return (
    <article
      data-testid="toggleComplete"
      className={`todo todo--toggle-completed ${todo.completed ? 'todo--completed' : ''
        }`}
      onClick={(e) => handleCompleted(todo.id)}
    >
      <button
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
