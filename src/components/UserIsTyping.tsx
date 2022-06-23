import { useOthers } from '@liveblocks/react';

const UserIsTyping = () => {
  const isTyping = useOthers()
    .toArray()
    .some((user) => user.presence?.isTyping);

  return (
    <div className="someone_is_typing">
      {isTyping ? 'Someone is typing...' : ''}
    </div>
  );
};

export default UserIsTyping;
