import useStore from '@store/.';
import { trpc } from '@utils/trpc';
import { v4 as uuid } from 'uuid';
import { HandleChangeFn, HandleSubmitFn } from '../types';

const AddTodo = () => {
  const store = useStore((state) => state);
  const { newTodo } = store;
  const allTodos = trpc.useQuery(['todo.all']);

  const utils = trpc.useContext();
  const addTask = trpc.useMutation('todo.add', {
    async onMutate({ project_id, title, description }) {
      await utils.cancelQuery(['todo.all']);
      const tasks = allTodos.data ?? [];
      utils.setQueryData(
        ['todo.all'],
        [
          ...tasks,
          {
            id: uuid(),
            project_id,
            title,
            description: description ?? '',
            completed: false,
          },

        ],
      );
    },
  });

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    store.setNewTodo({ ...newTodo, [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    addTask.mutate({
      project_id: newTodo.project_id,
      title: newTodo.title ?? '',
      description: newTodo.description ?? '',
    });
    store.addTodo();
  };

  return (
    <section className="flex justify-center ml-60">
      <form onSubmit={handleSubmit}>
        <fieldset className="flex flex-wrap">
          <legend className="mx-auto">Add a new task</legend>
          <label htmlFor="txtTodoItemToAdd">
            Title
            <input
              id="txtTodoItemToAdd"
              type="text"
              name="title"
              placeholder="Task title ..."
              value={newTodo.title ?? ''}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="add-description">
            Description
            <input
              id="add-description"
              name="description"
              placeholder="Short description of the task"
              value={newTodo.description ?? ''}
              onChange={handleChange}
            />
          </label>
          <button id="btnAddTodo" className="btn-black" type="submit">
            Add
          </button>
        </fieldset>
      </form>
    </section>
  );
};

export default AddTodo;
