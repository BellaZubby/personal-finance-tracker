"use client"
import HeaderText from "../shared/HeaderText";
import UnderlineSketch from "../shared/underlineSketch";
import {motion} from "framer-motion"

const About = () => {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center text-sunFlower px-6 py-20 bg-lavender font-inter"
    >
      <motion.div 
      className="max-w-4xl text-center"
      initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3}}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.4
            }
          }
        }}
      >
        <motion.div 
        className="relative"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
      duration: 1, // slower fade-in
      ease: "easeOut" // smoother easing
    }

             },
          }}

        >
           <HeaderText>Why We Built Akulsyt</HeaderText>
           <UnderlineSketch className="absolute left-[50%] -translate-x-1/2 top-8"/>
        </motion.div>
       
        <motion.p 
        className="text-lg leading-relaxed mt-10"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0 ,
              transition: {
      duration: 1, // slower fade-in
      ease: "easeOut" // smoother easing
    }
            }
          }}

        >
          Managing money shouldn&apos;t feel overwhelming. We created Akulyst to empower users with clarity, control, and confidence in their financial journey.
        </motion.p>
        <motion.p 
        className="mt-4 text-lg"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
      duration: 1, // slower fade-in
      ease: "easeOut" // smoother easing
    } 
            }
          }}

        >
          Akulyst is more than just tracking numbers, we help you build habits that align with your goals through smart budgetting, intuitive visuals, and AI-driven insights.
        </motion.p>
        <motion.p 
        className="mt-6 italic text-md text-gray-900"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
      duration: 1, // slower fade-in
      ease: "easeOut" // smoother easing
    }
            }
          }}

        >
          Akulyst isn&apos;t just about money. it&apos;s about mastery.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;