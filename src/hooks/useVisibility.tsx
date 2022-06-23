import { VisibilityContext } from 'context';
import { useContext } from 'react';
import { VisibilityProps } from 'types';

const useVisibility = () => {
  const [visibility, setVisibility] = useContext(VisibilityContext);

  return { visibility, setVisibility } as VisibilityProps;
};

export default useVisibility;
