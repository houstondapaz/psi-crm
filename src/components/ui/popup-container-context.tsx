"use client";

import { createContext, useContext } from "react";

const PopupContainerContext = createContext<HTMLElement | null>(null);

export function usePopupContainer() {
  return useContext(PopupContainerContext);
}

export const PopupContainerProvider = PopupContainerContext.Provider;
