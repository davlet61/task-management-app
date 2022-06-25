import useVisibility from '@hooks/useVisibility';
import { trpc } from '@utils/trpc';
import { Project } from 'types';
import { v4 as uuid } from 'uuid';
import AddProject from './AddProject';
import ProjectItem from './ProjectItem';
import { Inbox } from './SVGs';

const Sidebar = () => {
  const { visibility } = useVisibility();
  const projects = trpc.useQuery(['project.all']);
  const singleProject = trpc.useQuery(['project.single', { id: '1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07' }], {
    staleTime: 30000,
  });
  if (!projects.data || !singleProject.data) {
    return null;
  }

  const visible = `${visibility ? 'visible' : 'hidden'}`;

  const filteredProjects = projects.data?.filter((p: Project) => p.name !== 'Inbox');

  return (
    <aside className={`${visible} w-[100vw] z-10 sm:w-80 h-full shadow-md bg-neutral-50 p-1 flex flex-col items-center justify-start fixed overflow-auto`}>
      <ul className="relative mt-4">
        <li className="relative">
          <AddProject />
        </li>
        <li
          className="relative mt-4 flex gap-2 px-4 py-1 rounded items-center text-slate-700 hover:bg-neutral-200 transition-all duration-300 ease-in-out cursor-pointer active:bg-neutral-300"
        >
          <Inbox />
          <p>{singleProject.data.name}</p>
        </li>
      </ul>
      <hr className="h-0.5 w-2/3 mx-auto my-4 bg-gray-400 rounded" />
      <ul className="relative px-6 py-2 flex flex-col h-full gap-2">
        {filteredProjects.length > 0 && filteredProjects
          .map((p: Project) => <ProjectItem key={uuid()} project={p} />)}
      </ul>
    </aside>
  );
};

export default Sidebar;
