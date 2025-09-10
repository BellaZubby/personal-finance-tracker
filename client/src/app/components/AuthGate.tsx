"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { Spinner } from "./Spinner";

const AuthGate = ({ children }: { children: React.ReactNode }) => {

  const router = useRouter();


  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const rehydrated = useSelector((state: RootState) => state.auth.rehydrated);


  useEffect(() => {
    if (!rehydrated) return;
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, rehydrated, router]);

  return <>{children}</>;
};

export default AuthGate




