import { nanoid } from 'nanoid';
import useStore from 'store';
import { HandleChangeFn, HandleSubmitFn } from '../types';

const AddTodo = () => {
  const store = useStore((state) => state);
  const { newTodo } = store;

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    store.setNewTodo({ ...newTodo, id: nanoid(), [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    store.addTodo();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <fieldset className="add">
        <legend className="form__title">Add a new task</legend>
        <label htmlFor="txtTodoItemToAdd">Title</label>
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
        <label htmlFor="add-description">Description</label>
        <input
          className="add__description"
          id="add-description"
          name="description"
          placeholder="Short description of the task"
          value={newTodo.description}
          onChange={handleChange}
        />
        <button id="btnAddTodo" className="add__submit" type="submit">
          Add
        </button>
      </fieldset>
    </form>
  );
};

export default AddTodo;
