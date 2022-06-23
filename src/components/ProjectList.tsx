import useClickOutside from '@hooks/useClickOutside';
import { inferQueryOutput, trpc } from '@utils/trpc';
import { useRef, useState } from 'react';

type Project = inferQueryOutput<'project.all'>[number];

interface IProjectListProps {
  project: Project;
}

const ProjectList = ({ project }: IProjectListProps) => {
  const [projectName, setProjectName] = useState(project.name || '');
  const [editing, setEditing] = useState(false);
  const listRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();

  const editProject = trpc.useMutation('project.edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['project.all']);
      const allProjects = utils.getQueryData(['project.all']);
      if (!allProjects) {
        return;
      }
      utils.setQueryData(
        ['project.all'],
        allProjects.map((p) => (p.id === id
          ? {
            ...p,
            ...data,
          }
          : p)),
      );
    },
  });

  const deleteProject = trpc.useMutation('project.delete', {
    async onMutate() {
      await utils.cancelQuery(['project.all']);
      const allProjects = utils.getQueryData(['project.all']);
      if (!allProjects) {
        return;
      }
      utils.setQueryData(
        ['project.all'],
        allProjects.filter((p) => p.id !== project.id),
      );
    },
  });

  useClickOutside({
    ref: listRef,
    enabled: editing,
    callback() {
      editProject.mutate({
        id: project.id,
        data: { name: projectName },
      });
      setEditing(false);
    },
  });

  return (
    <li ref={listRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        name="project-name"
        value={projectName}
        onChange={(e) => {
          const newName = e.currentTarget.value;
          setProjectName(newName);
        }}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            editProject.mutate({
              id: project.id,
              data: { name: projectName },
            });
          }
          setEditing(false);
        }}
      />
      <button
        type="button"
        onClick={() => {
          setEditing(true);
          inputRef.current?.focus();
        }}
      >
        Edit

      </button>
      <button
        type="button"
        onClick={() => {
          deleteProject.mutate(project.id);
        }}
      >
        Delete

      </button>
    </li>
  );
};
export default ProjectList;
