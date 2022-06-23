import { useRouter } from 'next/router';
import { useMemo } from 'react';

const useOverrideRoomId = (roomId: string) => {
  const { query } = useRouter();
  const overrideRoomId = useMemo(() => (query?.roomId ? `${roomId}-${query.roomId}` : roomId), [query, roomId]);

  return overrideRoomId;
};

export default useOverrideRoomId;
