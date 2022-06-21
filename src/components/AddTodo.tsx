import useStore from '@store/.';
import { HandleChangeFn, HandleSubmitFn } from '../types';

const AddTodo = () => {
  const store = useStore((state) => state);
  const { newTodo } = store;

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    store.setNewTodo({ ...newTodo, [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    store.addTodo();
  };

  return (
    <section className="flex justify-center ml-60">
      <form className="form" onSubmit={handleSubmit}>
        <fieldset className="flex">
          <legend className="mx-auto">Add a new task</legend>
          <label htmlFor="txtTodoItemToAdd">
            Title
            <input
              className="add__title"
              id="txtTodoItemToAdd"
              type="text"
              name="title"
              placeholder="Task title ..."
              value={newTodo.title}
              onChange={handleChange}
              required
            />
          </label>
          <label htmlFor="add-description">
            Description
            <input
              className="add__description"
              id="add-description"
              name="description"
              placeholder="Short description of the task"
              value={newTodo.description}
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
