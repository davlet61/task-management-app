import { useOthers } from '@liveblocks/react';

const WhoIsHere = () => {
  const others = useOthers();

  return (
    <div className="who_is_here">
      There are
      {others.count}
      other users online
    </div>
  );
};

export default WhoIsHere;
