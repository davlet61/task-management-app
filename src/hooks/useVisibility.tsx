import { VisibilityContext } from 'context';
import { useContext } from 'react';

interface VisibilityProps {
  visibility: boolean;
  setVisibility: (visibility: boolean) => void;
}

const useVisibility = () => {
  const [visibility, setVisibility] = useContext(VisibilityContext);

  return { visibility, setVisibility } as VisibilityProps;
};

export default useVisibility;
