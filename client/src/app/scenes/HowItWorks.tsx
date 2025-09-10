"use client"
// HowItWorks.tsx
import { motion } from "framer-motion";
import { steps} from "../shared/types";
import Step from "../components/Step";
import HeaderText from "../shared/HeaderText";
import UnderlineSketch from "../shared/underlineSketch";
import Button from "../shared/Button";

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3, // delay between each child
    },
  },
};
const HowItWorks = () => {
  return (
    <section
      id="how_it_works"
      className="font-inter bg-howItWorks-gradient py-20 px-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
       initial = {{opacity: 0}}
       whileInView={{opacity: 1}}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
       className="max-w-6xl mx-auto text-center mb-12">
        {/* <h2 className="text-4xl font-bold text-sunPurple">Your Financial Toolkit</h2> */}
        <div className="relative">
           <HeaderText>Getting Started</HeaderText>
           <UnderlineSketch className="absolute left-[50%] -translate-x-1/2 top-8"/>
        </div>
        <p className="text-sunPurple mt-3">
          Six simple steps to take control of your financial future.
        </p>
      </motion.div>

      <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={container}
      >
        {steps.map((step, index) => (
            <Step key={index} title={step.title} description={step.description} />
          
        ))}
      </motion.div>
      <Button className="mt-5">Get Started</Button>
      </div>
     
    </section>
  );
}

export default HowItWorks