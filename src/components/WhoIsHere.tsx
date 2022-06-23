import { useOthers } from '@liveblocks/react';

const WhoIsHere = () => {
  const others = useOthers();

  return (
    <section className="flex justify-center items-center text-sm text-sky-800 italic mt-4 animate-pulse">
      <p>
        There are
        <span className="text-red-500 font-semibold">{` ${others.count} `}</span>
        other users online
      </p>
    </section>
  );
};

export default WhoIsHere;
