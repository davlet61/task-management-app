import {
  useState, createContext, useMemo, SetStateAction, Dispatch,
} from 'react';
import { createClient } from '@liveblocks/client';

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

export const client = createClient({
  publicApiKey: 'pk_live_xxxxxxxxxxxxxxxxxxxxxxxx',
});
