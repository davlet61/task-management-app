import React, { useRef } from 'react';
import { supabase } from '@lib/supabaseConfig';
import useStore from 'store';

const AddProject = () => {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const store = useStore((state) => state);
  const { newProject } = store;

  const addProject = () => newProject.name
    && supabase.from('projects').insert({
      name: newProject.name,
      user_id: supabase.auth.user()?.id,
    })
      .then(() => {
        store.addProject();
      });

  const handleCancel = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type !== 'mousedown' || (e as React.KeyboardEvent).key === 'Enter') {
      detailsRef.current?.removeAttribute('open');
    }
  };

  return (
    <details
      ref={detailsRef}
      className="flex flex-col items-center text-sm py-4 px-6 h-16 overflow-hidden cursor-pointer text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 ease-in-out open:h-40"
    >
      <summary className="list-plus text-red-600 text-[1rem]">Add Project</summary>
      <form
        className="flex flex-col items-center gap-2 mt-4 text-sm h-auto text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
        data-mdb-ripple="true"
        data-mdb-ripple-color="dark"
        data-testid="add-project-inner"
      >
        <input
          value={newProject.name}
          onChange={(e) => store.setNewProject({ ...newProject, name: e.target.value })}
          className=":placeholder-gray-500 p-2 w-11/12 outline-none border-2 border-solid border-gray-400 rounded"
          data-testid="project-name"
          type="text"
          placeholder="Name your project"
        />
        <div className="flex gap-1">
          <button
            className="btn-black"
            type="button"
            onClick={() => addProject()}
            data-testid="add-project-submit"
          >
            Add
          </button>
          <span
            aria-label="Cancel adding project"
            data-testid="hide-project-overlay"
            className="btn-black-outline"
            onClick={handleCancel}
            onKeyDown={handleCancel}
            role="button"
            tabIndex={0}
          >
            Cancel
          </span>
        </div>
      </form>
    </details>
  );
};

export default AddProject;
