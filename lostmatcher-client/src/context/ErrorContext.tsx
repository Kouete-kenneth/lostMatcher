import React, { createContext, useState } from 'react';

type ErrorContextType = {
  error: string | null;
  setError: (err: string | null) => void;
};

export const ErrorContext = createContext<ErrorContextType>({
  error: null,
  setError: () => {},
});

export function ErrorProvider({ children }: React.PropsWithChildren<{}>) {
  const [error, setError] = useState<string | null>(null);
  return (
    <ErrorContext.Provider value={{ error, setError }}>
      {children}
    </ErrorContext.Provider>
  );
}