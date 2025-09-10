import type { Metadata } from "next";


export const metadata: Metadata = {
  title:  "Verification"
};

const VerificationLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
        {/* <Navbar/> */}
          {children}
        {/* <Footer/> */}
    </div> 
  );
};
export default VerificationLayout