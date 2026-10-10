"use client";

import { createContext, useContext } from "react";

const DomainContactContext = createContext(null);

export function DomainContactProvider({ contact, children }) {
  return <DomainContactContext.Provider value={contact}>{children}</DomainContactContext.Provider>;
}

export function useDomainContact() {
  return useContext(DomainContactContext);
}
