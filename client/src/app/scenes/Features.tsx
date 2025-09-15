"use client";
import { motion } from "framer-motion";
import FeatureCard from "../components/Card";
import HeaderText from "../shared/HeaderText";
import { featureData } from "../shared/types";
import UnderlineSketch from "../shared/underlineSketch";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

const Features = () => {
  return (
    <section id="features" className="py-20 px-6 bg-slate-100 font-inter">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: "easeOut" }}
        className="max-w-6xl mx-auto text-center mb-12"
      >
        <div className="relative">
          <HeaderText>Your Financial Toolkit</HeaderText>
          <UnderlineSketch className="absolute left-[50%] -translate-x-1/2 top-8" />
        </div>
        <p className="text-sunPurple mt-3">
          Everything you need to take control of your money—all in one place.
        </p>
      </motion.div>
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {featureData.map((card) => (
          <motion.div
            key={card.id}
            variants={cardVariants}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <FeatureCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
              buttonText={card.buttonText}
              route={card.route}
            />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default Features;
