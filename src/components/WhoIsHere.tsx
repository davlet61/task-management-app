import { useOthers } from '@liveblocks/react';

const WhoIsHere = () => {
  const others = useOthers();

  return (
    <div className="who_is_here">
      <p>
        There are
        <span>{others.count}</span>
        other users online
      </p>
    </div>
  );
};

export default WhoIsHere;
