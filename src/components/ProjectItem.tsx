import useClickOutside from '@hooks/useClickOutside';
import { inferQueryOutput, trpc } from '@utils/trpc';
import { useRef, useState } from 'react';
import { DeleteButton, EditButton } from './SVGs';

type Project = inferQueryOutput<'project.all'>[number];

interface IProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: IProjectItemProps) => {
  const [projectName, setProjectName] = useState(project.name || '');
  const [editing, setEditing] = useState(false);
  const listRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
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

  const handleDelete = () => {
    deleteProject.mutate(project.id);
  };

  const handleEdit = () => {
    setEditing(true);
    inputRef.current?.focus();
  };

  return (
    <li ref={listRef} className="relative flex flex-1 h-full p-2 gap-4 bg-slate-400 border-2 rounded hover:cursor-move" draggable>
      <textarea
        ref={inputRef}
        name="project-name"
        className="w-full h-auto px-2 py-1 text-base text-white bg-transparent text-center resize-none select-auto overflow-hidden focus:outline-none "
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
      <div className="flex flex-col justify-center items-center gap-1">
        <EditButton edit={handleEdit} />
        <DeleteButton click={handleDelete} />
      </div>
    </li>
  );
};
export default ProjectItem;
