import React, { useState } from 'react';
import { supabase } from '@lib/supabaseConfig';

const AddProject = () => {
  const [projects, setProjects] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [projectName, setProjectName] = useState('');

  const addProject = () => projectName
    && supabase.from('projects').insert({
      name: projectName,
      user_id: supabase.auth.user()?.id,
    })
      .then(() => {
        setProjects([...projects]);
        setProjectName('');
        setIsExpanded(false);
      });

  return isExpanded ? (
    <form
      className="flex items-center text-sm py-4 px-6 h-12 overflow-hidden text-gray-700 text-ellipsis whitespace-nowrap rounded hover:text-gray-900 hover:bg-gray-100 transition duration-300 ease-in-out"
      data-mdb-ripple="true"
      data-mdb-ripple-color="dark"
      data-testid="add-project-inner"
    >
      <input
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className=":placeholder-gray-500 p-1.5 px-4 outline-none border-2 border-solid border-gray-400 rounded"
        data-testid="project-name"
        type="text"
        placeholder="Name your project"
      />
      <button
        className="btn-black"
        type="button"
        onClick={() => addProject()}
        data-testid="add-project-submit"
      >
        Add Project
      </button>
      <span
        aria-label="Cancel adding project"
        data-testid="hide-project-overlay"
        className="btn-black-outline"
        onClick={() => setIsExpanded(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setIsExpanded(false);
        }}
        role="button"
        tabIndex={0}
      >
        Cancel
      </span>
    </form>
  ) : (
    <section className="text-red-700 display-flex" data-testid="add-project">
      <span className="text-red-700 text-lg">&#43;</span>
      <span
        aria-label="Add Project"
        data-testid="add-project-action"
        className="text-base"
        onClick={() => setIsExpanded((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setIsExpanded((prev) => !prev);
        }}
        role="button"
        tabIndex={0}
      >
        Add Project
      </span>
    </section>
  );
};

export default AddProject;
