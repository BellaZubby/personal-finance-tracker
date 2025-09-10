import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Dashboard"
};

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
     
          {children}
        
    </> 
  );
};
export default DashboardLayout