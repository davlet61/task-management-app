import useStore from 'store';
import AddProject from './AddProject';

const Sidebar = () => {
  const { projects } = useStore((state) => state);

  return (
    <aside className="w-60 h-full shadow-md bg-white px-1 fixed">
      <ul className="relative">
        <li className="relative">
          <AddProject />
        </li>
      </ul>
      <hr className="h-0.5 w-2/3 mx-auto my-4 bg-gray-400 rounded" />
      <ul className="relative px-6 py-2">
        {projects.length > 0 && projects.map((p) => (
          <li key={p.id} className="relative">
            <h3>{p.name}</h3>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
