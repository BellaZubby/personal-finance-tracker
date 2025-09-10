"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";

type Props = {
  children: React.ReactNode;
};
const ProtectedRoute = ({ children }: Props) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const rehydrated = useSelector((state: RootState) => state.auth.rehydrated);
  const user = useSelector((state: RootState) => state.auth.user);

  const router = useRouter();

  useEffect(() => {
    // wait until Redux store is rehydrated before checking auth
    if (!rehydrated) return;

    // redirect only if user is truly unaunthenticated
    if (!isAuthenticated) {
      router.replace("/signin");
    };
  }, [isAuthenticated, rehydrated, router]);


//   show loading spinner while waiting for rehydration
  if (!rehydrated) {
      return (<main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500 text-sm">Loading ...</p>
      </main>);
    }
    // handle edge case: authenticated but no user data
    if (!user && isAuthenticated) {
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">
          User data missing. Please log in again.
        </p>
      </div>;
    }
  
    // render protected content if authenticated
  return isAuthenticated ? <>{children}</> : null;
};
export default ProtectedRoute;
