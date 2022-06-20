import { ReactNode } from 'react';
import useStore from 'store';

const Popup = ({ children }: { children: ReactNode }) => {
  const { visibility, setVisibility } = useStore((state) => state);

  const handleClearStorage = () => {
    setVisibility();
    localStorage.clear();
  };

  return (
    <div
      style={{
        visibility: visibility === true ? 'visible' : 'hidden',
        opacity: visibility === true ? '1' : '0',
      }}
      className="overlay"
    >
      <div className="popup">
        <span className="popup__close">
          &times;
        </span>
        <div className="popup__content">{children}</div>
        <button
          className="button--popup"
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
