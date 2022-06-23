import { ReactNode, useState } from 'react';

const Popup = ({ children }: { children: ReactNode }) => {
  const [visibility, setVisibility] = useState(false);

  const handleClearStorage = () => {
    setVisibility(true);
    localStorage.clear();
  };

  return (
    <div
      style={{
        visibility: visibility === true ? 'visible' : 'hidden',
        opacity: visibility === true ? '1' : '0',
      }}
      className="flex justify-center ml-60"
    >
      <div className="popup">
        <span className="popup__close">
          &times;
        </span>
        <div className="popup__content">{children}</div>
        <button
          className="btn-red uppercase "
          type="submit"
          onClick={handleClearStorage}
        >
          i understand
        </button>
      </div>
    </div>
  );
};

export default Popup;
