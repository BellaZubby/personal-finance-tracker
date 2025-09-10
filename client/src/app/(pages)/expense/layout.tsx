import type { Metadata } from "next";

export const metadata: Metadata = {
  title:  "Expense-tracking"
};

const ExpenseLayout = ({
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
export default ExpenseLayout