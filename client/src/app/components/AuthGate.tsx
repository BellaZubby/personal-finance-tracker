"use client"
import { usePathname, useRouter } from "next/navigation";
import { useEffect} from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";


type Props = {
  children: React.ReactNode;
  redirectTo?: string;

}

const AuthGate = ({ children, redirectTo = "/"}: Props) => {

  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const rehydrated = useSelector((state: RootState) => state.auth.rehydrated);


  useEffect(() => {
    if (!rehydrated) return;

    // only redirect if user is on a public page
    const publicPages = ["/signin", "/signup", "/verification", "/forgot-password", "/reset-password"]
    if (isAuthenticated && publicPages.includes(pathname)) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, rehydrated, pathname, router]);

  return <>{children}</>;
};

export default AuthGate




