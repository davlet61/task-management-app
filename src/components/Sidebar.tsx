import useVisibility from '@hooks/useVisibility';
import { trpc } from '@utils/trpc';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Project } from 'types';
import { v4 as uuid } from 'uuid';
import AddProject from './AddProject';
import ProjectItem from './ProjectItem';
import { Inbox } from './SVGs';
import WhoIsHere from './WhoIsHere';

const Sidebar = () => {
  const { visibility, setVisibility } = useVisibility();
  const { push } = useRouter();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && visibility) {
        setVisibility(!visibility);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setVisibility, visibility]);

  const projects = trpc.useQuery(['project.all']);
  if (!projects.data) {
    return null;
  }

  const visible = `${visibility ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`;

  const filteredProjects = projects.data?.filter((p: Project) => p.name !== 'Inbox');

  const handleClickOrEnter = (e: React.KeyboardEvent | React.MouseEvent) => {
    if (e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') {
      push('/projects/1ce88c26-9e9a-44ea-b5e2-9ea6f8f1fb07');
    }
  };

  return (
    <aside className={`${visible} w-[100vw] z-10 md:w-80 h-full shadow-md bg-neutral-50 p-1 flex flex-col items-center justify-start fixed overflow-auto transition-all duration-300 ease-in-out`}>
      <WhoIsHere />
      <ul className="relative mt-4">
        <li className="relative">
          <AddProject />
        </li>
        <li>
          <div
            role="button"
            tabIndex={0}
            onClick={handleClickOrEnter}
            onKeyDown={handleClickOrEnter}
            className="relative mt-4 flex gap-2 px-4 py-1 rounded items-center text-slate-700 hover:bg-neutral-200 transition-all duration-300 ease-in-out cursor-pointer active:bg-neutral-300"
          >
            <Inbox />
            <p>Inbox</p>
          </div>
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
