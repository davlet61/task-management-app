import { useOthers } from '@liveblocks/react';
import { Presence } from 'types';
import Cursor from './Cursor';

const COLORS = [
  '#E57373',
  '#9575CD',
  '#4FC3F7',
  '#81C784',
  '#FFF176',
  '#FF8A65',
  '#F06292',
  '#7986CB',
];

const UserCursor = () => {
  const others = useOthers<Presence>();

  return (
    <>
      {
        others.map(({ connectionId, presence }) => {
          if (presence == null || presence.cursor == null) {
            return null;
          }

          return (
            <Cursor
              key={`cursor-${connectionId}`}
              color={COLORS[connectionId % COLORS.length]}
              x={presence.cursor.x}
              y={presence.cursor.y}
            />
          );
        })
      }
    </>
  );
};

export default UserCursor;
