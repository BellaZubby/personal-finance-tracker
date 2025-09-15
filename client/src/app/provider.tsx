// created a Providers component to wrap our layout to bind our redux to our react application.
//  since redux uses hooks internally, and root layout MUST always be a Server-side component, thus the need for the component
"use client";
import { Provider } from "react-redux";
import { store } from "./store";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>; // // this wraps our application in Redux's <Provider>, injecting the store
};
