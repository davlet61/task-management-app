import { useOthers } from '@liveblocks/react';
import { ICursor, Presence } from 'types';
import Cursor from './Cursor';

interface IUserCursorProps {
  cursor: ICursor | null;
}

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

const UserCursor = ({ cursor }: IUserCursorProps) => {
  const others = useOthers<Presence>();

  return (
    <>
      <div className="max-w-sm text-center">
        {cursor
          ? `${cursor.x} × ${cursor.y}`
          : 'Move your cursor to broadcast its position to other people in the room.'}
      </div>
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
