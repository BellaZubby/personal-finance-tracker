import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Forgot-Password"
};

const ForgotPasswordLayout = ({
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
export default ForgotPasswordLayout