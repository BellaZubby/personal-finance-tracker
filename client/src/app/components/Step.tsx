"use client";
import { motion } from "framer-motion";
import { howItWorksProps } from "../shared/types";

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const Step = ({ title, description }: howItWorksProps) => (
  <motion.div
    className="bg-white shadow-md rounded-lg p-6 mb-6 text-left"
    variants={fadeLeft}
    initial="hidden"
    whileInView="visible"
    transition={{ duration: 0.7, ease: "easeOut" }}
    viewport={{ once: true, amount: 0.5 }}
  >
    <>
      <h3 className="text-lg font-semibold text-sunPurple mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </>
  </motion.div>
);

export default Step;
