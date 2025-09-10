"use client";
import { motion } from "framer-motion";
import { fadeIn } from "../hooks/motion";
import Sketch from "../shared/sketch";
import UnderlineSketch from "../shared/underlineSketch";
import useMediaQuery from "../hooks/useMediaQuery";
import Button from "../shared/Button";


export default function Hero() {
  const isMobileScreen = useMediaQuery("(max-width:560px)");
   const phrases = [
    { animated: "Budget", static: "Better.", mobileBreakline: true },
    { animated: "Spend", static: "Smarter.", left: true, mobileBreakline: true},
    { animated: "Save", static: "More.", breakLine: true, mobileBreakline: true}
  ];

  return (
    <motion.section 
    id="hero" 
    className="relative min-h-screen px-6 text-center bg-cover bg-center z-0 bg-fixed bg-[url('/graph-bg.jpg')] font-inter"
    >
       {/* <div className="absolute inset-0 bg-cover bg-center z-0 bg-fixed" style={{ backgroundImage: "url('/graph-bg.jpg')" }}> */}

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent z-10 flex flex-col justify-center items-center">

  {/* Content */}

      <motion.div
        // initial={{ opacity: 0, y: -30 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ duration: 0.8 }}
        initial = {{
           y: 30,
        opacity: 0,
        x: -30,
        transition: {
          type: 'tween',
          duration: 1.5,
          delay: 0.4,
          ease: [0.25, 0.6, 0.3, 0.8] as [number, number, number, number], // 👈 cast explicitly
        },
        }} 
        
        animate = {{
           y: 0,
        x: 0,
        opacity: 1,
        transition: {
          type: 'tween',
          duration: 1.4,
          delay: 0.4,
          ease: [0.25, 0.25, 0.25, 0.75] as [number, number, number, number], // 👈 cast explicitly
        },
        }}
        className="text-5xl md:text-6xl font-extrabold text-white mb-4 font-playfair"
      >
          {/* CHECK */}
          {phrases.map((phrase, index) => (
        <div key={index}
          className={isMobileScreen ? `inline-block ${phrase.mobileBreakline ? "block mt-5 w-full" : ""} `:`inline-block ${phrase.breakLine ? "block mt-5 w-full" : ""} ${phrase.left ? "ml-5": ""}`}
>
          <motion.p
            className="text-amber inline-block"
            initial={{scale:1}}
            animate={{ scale: [1, 1.05, 1], opacity: [1, 0.9, 1]}}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: phrases.length * 2,
              ease: "easeInOut",
              delay: index * 2,
            }}
          >
            {phrase.animated}
          </motion.p>{" "}
          <span>{phrase.static}</span>
        </div>
      ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-lg md:text-xl text-white max-w-xl mb-8 font-inter"
      >
        Akulyst helps you track spending, set goals, and build financial confidence—without the overwhelm.
      </motion.p>

      {/* <motion.button
        initial={{y: 80, opacity: 0}}
        animate={{
            y:0,
            opacity: 1,
            transition: {
                delay:0.7,
                duration: 0.7,
            },
        }}
        className="bg-amber text-black px-6 py-3 rounded-full text-lg font-medium shadow-md hover:bg-plum hover:text-gray-700 transition-colors duration-500 ease-in-out"
        onClick={() => {
          const section = document.getElementById("features");
          section?.scrollIntoView({ behavior: "smooth" });
        }}

      >
        Explore Features
      </motion.button> */}
      <Button>Explore Akulyst</Button>
      </div>
    </motion.section>
  );
}