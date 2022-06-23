import { trpc } from '@utils/trpc';
import { v4 as uuid } from 'uuid';
import AddProject from './AddProject';
import ProjectItem from './ProjectItem';

const Sidebar = () => {
  const projects = trpc.useQuery(['project.all']);
  if (!projects.data) {
    return null;
  }

  return (
    <aside className="w-60 h-full shadow-md bg-white px-1 fixed">
      <ul className="relative">
        <li className="relative">
          <AddProject />
        </li>
      </ul>
      <hr className="h-0.5 w-2/3 mx-auto my-4 bg-gray-400 rounded" />
      <ul className="relative px-6 py-2 flex flex-col flex-1 gap-2">
        {projects.data.length > 0 && projects.data
          .map((p) => <ProjectItem key={uuid()} project={p} />)}
      </ul>
    </aside>
  );
};

export default Sidebar;
