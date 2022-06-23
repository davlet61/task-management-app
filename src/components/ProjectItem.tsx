import useClickOutside from '@hooks/useClickOutside';
import { inferQueryOutput, trpc } from '@utils/trpc';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import useVisibility from '@hooks/useVisibility';
import { DeleteButton, EditButton, LinkButton } from './SVGs';

type Project = inferQueryOutput<'project.all'>[number];

interface IProjectItemProps {
  project: Project;
}

const ProjectItem = ({ project }: IProjectItemProps) => {
  const { setVisibility } = useVisibility();
  const [projectName, setProjectName] = useState(project.name);
  const [editing, setEditing] = useState(false);
  const listRef = useRef<HTMLLIElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const utils = trpc.useContext();
  const router = useRouter();

  const editProject = trpc.useMutation('project.edit', {
    async onMutate({ id, data }) {
      await utils.cancelQuery(['project.all']);
      const allProjects = utils.getQueryData(['project.all']);
      if (!allProjects) {
        return;
      }
      utils.setQueryData(
        ['project.all'],
        allProjects.map((p: Project) => (p.id === id
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
        allProjects.filter((p: Project) => p.id !== project.id),
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
    setEditing((prev) => !prev);
    editing ? inputRef.current?.blur() : inputRef.current?.focus();
  };

  const handleRoute = () => {
    router.push(`/projects/${project.id}`);
    setVisibility(false);
  };

  return (
    <li
      ref={listRef}
      className="relative flex p-2 gap-4 bg-slate-600 border-2 rounded hover:cursor-move"
      draggable={!editing}
    >
      <LinkButton click={handleRoute} />
      <input
        id="textarea"
        ref={inputRef}
        name="project-name"
        className="w-full h-auto px-2 py-1 text-sm text-white bg-transparent text-center focus:outline-none caret-orange-500"
        value={projectName}
        onFocus={(e) => {
          e.currentTarget.selectionStart = e.currentTarget.value.length;
          setEditing(true);
        }}
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
      <div className="flex flex-col justify-center items-center gap-1.5">
        <EditButton click={handleEdit} editing={editing} sidebar />
        <DeleteButton click={handleDelete} />
      </div>
    </li>
  );
};
export default ProjectItem;
