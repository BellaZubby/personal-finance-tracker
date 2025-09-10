import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Reset-Password"
};

const ResetPasswordLayout = ({
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
export default ResetPasswordLayout