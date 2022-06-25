import {
  useState, createContext, useMemo, SetStateAction, Dispatch,
} from 'react';

type VisibilityContextType = (boolean | Dispatch<SetStateAction<boolean>>)[];

export const VisibilityContext = createContext<VisibilityContextType>([]);

export const VisibilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [visibility, setVisibility] = useState(false);

  const value = useMemo(() => [visibility, setVisibility], [visibility]);

  return (
    <VisibilityContext.Provider value={value}>
      {children}
    </VisibilityContext.Provider>
  );
};
