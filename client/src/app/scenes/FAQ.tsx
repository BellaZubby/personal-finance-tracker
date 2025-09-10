"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaXmark } from "react-icons/fa6"; 
import { faqs } from "../shared/types";
import HeaderText from "../shared/HeaderText";
import UnderlineSketch from "../shared/underlineSketch";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-12 px-4 bg-sunPurple/60 text-white font-inter">
     <motion.div 
       initial = {{opacity: 0}}
       whileInView={{opacity: 1}}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
       className="max-w-6xl mx-auto text-center mb-12">
        {/* <h2 className="text-4xl font-bold text-sunPurple">Your Financial Toolkit</h2> */}
        <div className="relative">
           <HeaderText>FAQs</HeaderText>
           <UnderlineSketch className="absolute left-[50%] -translate-x-1/2 top-8"/>
        </div>
        <p className="text-white mt-3">
          Got questions? We've got clarity.
        </p>
      </motion.div>
      <div className="max-w-xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 shadow-sm bg-white"
          >
            <button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full text-left flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-lg font-semibold text-sunPurple">
                {faq.question}
              </h3>
              {activeIndex === index && (
                <FaXmark className="w-5 h-5 text-gray-500" />
              )}
            </button>

            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="mt-3 overflow-hidden text-gray-700"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FAQ