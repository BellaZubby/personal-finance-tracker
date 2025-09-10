import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Sign Up"
};

const SignUpLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
          {children}
    </div>  
  );
}
export default SignUpLayout