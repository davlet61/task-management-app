import useStore from '@store/.';
import TodoItem from './TodoItem';

const TodoList = () => {
  const { todos } = useStore((state) => state);

  if (!todos || todos.length === 0) {
    return (
      <section id="todoList" className="todo-wrapper">
        <article className="todo todo--reverse">
          <h3 className="todo__text">No tasks to display!</h3>
        </article>
      </section>
    );
  }

  return (
    <section id="todoList" className="flex flex-col ">
      {todos.map((todo) => <TodoItem key={todo.id} todo={todo} />)}
    </section>
  );
};

export default TodoList;
