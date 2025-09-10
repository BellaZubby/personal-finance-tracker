import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Budget"
};

const BudgetLayout = ({
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
export default BudgetLayout