"use client";
import { motion } from "framer-motion";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string; //making className optional with the use of a question mark
};

const Button = ({ children, className }: Props) => {
  return (
    <motion.button
      initial={{ y: 80, opacity: 0 }}
      whileInView={{
        y: 0,
        opacity: 1,
        transition: {
          delay: 0.7,
          duration: 0.7,
        },
      }}
      viewport={{ once: true, amount: 0.5 }}
      className={`${className} bg-plum text-black px-6 py-3 rounded-full text-md font-semibold shadow-md hover:bg-amber hover:text-gray-700 transition-colors duration-500 ease-in-out cursor-pointer`}
      onClick={() => {
        const section = document.getElementById("features");
        section?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      {children}
    </motion.button>
  );
};

export default Button;
