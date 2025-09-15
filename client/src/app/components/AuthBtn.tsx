import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string; //making className optional with the use of a question mark
  loading?: boolean;
};

const AuthBtn = ({ children, className, loading }: Props) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`${className} ${
        loading
          ? "bg-amber/50 text-black/20"
          : "bg-amber text-black hover:bg-plum hover:text-gray-700"
      } px-6 py-3 rounded-full text-md font-semibold shadow-md transition-colors duration-500 ease-in-out cursor-pointer`}
    >
      {children}
    </button>
  );
};

export default AuthBtn;
