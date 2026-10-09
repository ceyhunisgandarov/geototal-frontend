"use client";

import { createContext, useContext } from "react";
import { supportedLocales } from "@/lib/locales";

const DomainLocalesContext = createContext(supportedLocales);

export function DomainLocalesProvider({ locales, children }) {
  return <DomainLocalesContext.Provider value={locales}>{children}</DomainLocalesContext.Provider>;
}

export function useDomainLocales() {
  return useContext(DomainLocalesContext);
}
