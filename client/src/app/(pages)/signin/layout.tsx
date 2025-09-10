import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Sign in"
};

const SignInLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
          {children}
    
    </> 
  );
}
export default SignInLayout