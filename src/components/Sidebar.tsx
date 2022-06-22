import { trpc } from '@utils/trpc';
import { nanoid } from 'nanoid';
import AddProject from './AddProject';

const Sidebar = () => {
  const projects = trpc.useQuery(['all'], {
    staleTime: 3000,
  });
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
      <ul className="relative px-6 py-2">
        {projects.data.length > 0 && projects.data.map((p) => (
          <li key={nanoid()} className="relative">
            <h3>{p.name}</h3>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
