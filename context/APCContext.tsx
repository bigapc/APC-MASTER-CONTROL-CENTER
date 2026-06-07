"use client";

import {
  createContext,
  useContext,
} from "react";

const APCContext = createContext({
  selectedApp: "safeconnect",
});

export const useAPC = () =>
  useContext(APCContext);

export default function APCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <APCContext.Provider
      value={{
        selectedApp: "safeconnect",
      }}
    >
      {children}
    </APCContext.Provider>
  );
}
