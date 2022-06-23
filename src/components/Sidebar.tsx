import { trpc } from '@utils/trpc';
import { v4 as uuid } from 'uuid';
import AddProject from './AddProject';
import ProjectItem from './ProjectItem';
import { Inbox } from './SVGs';

const Sidebar = () => {
  const projects = trpc.useQuery(['project.all']);
  const singleProject = trpc.useQuery(['project.single', { id: 'ee331808-b953-45df-87a3-822450197a47' }], {
    staleTime: 30000,
  });
  if (!projects.data || !singleProject.data) {
    return null;
  }

  return (
    <aside className="w-60 h-full shadow-md bg-white p-1 flex flex-col items-center justify-start fixed">
      <ul className="relative mt-4">
        <li className="relative">
          <AddProject />
        </li>
        <li
          className="relative mt-4 flex gap-2 items-center text-slate-700"
        >
          <Inbox />
          <p>{singleProject.data.name}</p>
        </li>
      </ul>
      <hr className="h-0.5 w-2/3 mx-auto my-4 bg-gray-400 rounded" />
      <ul className="relative px-6 py-2 flex flex-col h-full gap-2">
        {projects.data.length > 0 && projects.data
          .map((p) => <ProjectItem key={uuid()} project={p} />)}
      </ul>
    </aside>
  );
};

export default Sidebar;
