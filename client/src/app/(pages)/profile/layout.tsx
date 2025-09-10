import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Profile"
};

const ProfileLayout = ({
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
export default ProfileLayout