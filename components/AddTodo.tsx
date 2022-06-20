import { useState } from 'react';
import { v4 } from 'uuid';
import { Task, HandleChangeFn, HandleSubmitFn } from '../types';

const AddTodo = () => {
  const initialState: Task = {
    id: '',
    title: '',
    description: '',
    completed: false,
  };
  const [todo, setTodo] = useState<Task>(initialState);
  const dispatch = useAppDispatch();

  const handleChange: HandleChangeFn = (e) => {
    const { value, name } = e.target;
    setTodo({ ...todo, id: v4(), [name]: value });
  };

  const handleSubmit: HandleSubmitFn = (e) => {
    e.preventDefault();
    if (todo !== initialState) {
      dispatch(addTodo(todo));
    }
    setTodo(initialState);
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
          value={todo.title}
          onChange={handleChange}
          required
        />
        <label htmlFor="add-description">Description</label>
        <input
          className="add__description"
          id="add-description"
          name="description"
          placeholder="Short description of the task"
          value={todo.description}
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
