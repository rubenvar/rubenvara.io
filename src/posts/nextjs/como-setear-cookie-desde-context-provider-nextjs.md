---
title: Cómo fijar una cookie desde Context Provider en Next.js
date: 2021-05-07
status: draft
---

## setting a cookie from local state context

```tsx
import { createContext, useContext, useState } from 'react';
import cookieCutter from 'cookie-cutter';

let initial = false;

interface ILocalCookieWarStateContext {
  isClosed: boolean;
  closeWarning: () => void;
}

const defautlContextContent: ILocalCookieWarStateContext = {
  isClosed: initial, // default
  closeWarning: () => {},
};

const LocalStateContext = createContext<ILocalCookieWarStateContext>(
  defautlContextContent
);
const LocalStateProvider = LocalStateContext.Provider;

// eslint-disable-next-line react/prop-types
function CookieWarStateProvider({ children }: { children: React.ReactNode }) {
  if (typeof window !== 'undefined') {
    const closedInCookie: string | undefined = cookieCutter.get('cwarclosed');
    initial = !!closedInCookie; // change default with cookie if browser
  }
  const [isClosed, setIsClosed] = useState(initial);

  const closeWarning = () => {
    // hide the thing
    setIsClosed(true);
    // set a cookie to keep it hidden (store closed=true, expires in a month)
    const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    // const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
    cookieCutter.set('cwarclosed', true.toString(), { expires });
  };

  return (
    <LocalStateProvider
      value={{
        isClosed,
        closeWarning,
      }}
    >
      {children}
    </LocalStateProvider>
  );
}

function useCookieWar() {
  const all = useContext(LocalStateContext);
  return all;
}

export { CookieWarStateProvider, useCookieWar };

```
