import supabase from '@lib/supabaseConfig';
import { v4 as uuid } from 'uuid';
import React, { useRef, useState } from 'react';
import { trpc } from '@utils/trpc';
import { Project } from 'types';

const AddProject = () => {
  const detailsRef = useRef<HTMLDetailsElement | null>(null);
  const initialProject: Project = {
    id: '',
    user_id: '311eb43d-d131-4d97-8588-87db10048ca3',
    name: '',
    todos: [],
  };
  const [newProject, setNewProject] = useState(initialProject);
  const allProjects = trpc.useQuery(['project.all']);

  const utils = trpc.useContext();
  const addNewProject = trpc.useMutation('project.add', {
    async onMutate({ name, user_id }) {
      await utils.cancelQuery(['project.all']);
      const projects = allProjects.data ?? [];
      utils.setQueryData(
        ['project.all'],
        [
          ...projects,
          {
            id: uuid(),
            user_id,
            name,
            todos: [],
          },
        ],
      );
    },
  });
  const addProject = () => {
    const user = supabase.auth.user();
    addNewProject
      .mutate({
        user_id: user?.id || newProject.user_id as string,
        name: newProject.name,
      });
    setNewProject(initialProject);
  };

  const handleCancel = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type !== 'mousedown' || (e as React.KeyboardEvent).key === 'Enter') {
      detailsRef.current?.removeAttribute('open');
    }
  };

  return (
    <details
      ref={detailsRef}
      className="flex flex-col items-center text-sm py-4 px-6 h-16 overflow-hidden cursor-pointer text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-neutral-200 transition-all duration-300 ease-in-out open:h-40"
    >
      <summary className="list-plus text-red-600 text-[1rem]">Add Project</summary>
      <form
        className="flex flex-col items-center gap-2 mt-4 text-sm h-auto text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 transition duration-300 ease-in-out"
        data-mdb-ripple="true"
        data-mdb-ripple-color="dark"
        data-testid="add-project-inner"
      >
        <input
          value={newProject.name ?? ''}
          onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          className=":placeholder-gray-500 p-2 w-11/12 outline-none border-2 border-solid border-gray-400 rounded"
          type="text"
          placeholder="Name your project"
        />
        <div className="flex gap-1">
          <button
            className="btn-red"
            type="button"
            onClick={() => addProject()}
            data-testid="add-project-submit"
          >
            Add
          </button>
          <span
            aria-label="Cancel adding project"
            data-testid="hide-project-overlay"
            className="btn-red-outline"
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
