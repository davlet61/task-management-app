import { ReactNode } from 'react';

const Popup = ({ children }: { children: ReactNode }) => {
  const handleClearStorage = () => {
    localStorage.clear();
  };

  return (
    <div
      // style={{
      //   visibility: visibility === true ? 'visible' : 'hidden',
      //   opacity: visibility === true ? '1' : '0',
      // }}
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
