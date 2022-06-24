import { Task } from 'types';
import TodoItem from './__TodoItem';

interface ITodoListProps {
  tasks: Task[];
}

const TodoList = ({ tasks }: ITodoListProps) => {
  if (!tasks || tasks.length === 0) {
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
      {tasks.map((task) => <TodoItem key={task.id} todo={task} />)}
    </section>
  );
};

export default TodoList;
