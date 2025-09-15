import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Sign-In"
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