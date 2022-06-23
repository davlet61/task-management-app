import { useOthers } from '@liveblocks/react';

const UserIsTyping = ({ action }: { action: string }) => {
  const isTyping = useOthers()
    .toArray()
    .some((user) => user.presence?.isTyping);

  return (
    <p className="text-slate-800 text-lg">
      {isTyping ? `Someone is ${action}...` : ''}
    </p>
  );
};

export default UserIsTyping;
