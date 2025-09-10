"use client"
import React, { useEffect, useState } from 'react'
import useMediaQuery from '@/app/hooks/useMediaQuery'
import DesktopNav from './navbar/desktopNav'
import MobileNav from './navbar/mobileNav'
import { motion } from 'framer-motion'
import { UserType } from '../shared/types'
import { getMockData } from '../utils/auth'
import { menuLinks } from "@/app/shared/types";
import { usePathname } from 'next/navigation';
import { userNavLinks } from '../shared/types'
import { useDispatch } from 'react-redux'
import { rehydrateAuth } from '../store/authSlice'


type Props = {}

const Navbar = (props: Props) => {
    const pathname = usePathname();
    const isAboveMediumScreens = useMediaQuery("(min-width:1060px)");
    const [activeSection, setActiveSection] = useState<string>("hero"); // A useState to track the active nav item based on which section is in view
    // const [user, setUser] = useState<UserType | null>(null);
    const [isAvatarToggled, setIsAvatarToggled] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const hiddenRoutes = ['/signup', '/signin', '/verification', "/forgot-password", "/reset-password"]; // defines route that should not show the navbar
    const showMenuLinks = pathname === '/'; // path to show the menulinks (home, about, features...)


    // PERSISTING SESSION
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(rehydrateAuth());
    }, [dispatch]);

    // console.log(activeSection);
  // Simulate user login state
  // useEffect(() => {
  //   const mock = getMockData();
  //   setUser(mock.isLoggedIn ? mock : null);
  // }, []);

  // Track active section using IntersectionObserver: an inbuilt browser API
  useEffect(() => {
    // creates an instance of IntersectionObserver class which takes in two arguments: a callback and options
    const observer = new IntersectionObserver(
      entries => { // The callback function runs whenever an observed element enters or exits the view port
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const currentSection = entry.target.id
            setActiveSection(currentSection);
            console.log(currentSection);
          }
        });
      },
      { threshold: 0.6} // determines how sensitive the observer should be
    );

    const sections = document.querySelectorAll("section"); // Selects all <section> elements on the 

    sections.forEach(section => observer.observe(section)); // tells the observer to watch each section

    return () => observer.disconnect(); // cleanup function after component unmounts.
  }, []);

  // Scroll to section smoothly
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false); 
    }
  };

  // checks is the pathname is either /signup, /signin, /verification, then the navbar is not shown.

  if (hiddenRoutes.includes(pathname)) {
      return null; // don't render anything
    }

  

  return (
         <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full shadow-md z-50 bg-neutral-200 md:px-10 xs:px-12 px-4 font-inter font-semibold text-sunPurple"
    >
             {
                isAboveMediumScreens ? (
                // Desktop Navbar
                <DesktopNav
                  menuLinks = {menuLinks}
                  activeSection ={activeSection}
                  isAvatarToggled = {isAvatarToggled}
                  setIsAvatarToggled = {setIsAvatarToggled}
                  scrollToSection = {scrollToSection}
                  showMenuLinks ={showMenuLinks}
                  userNavLinks = {userNavLinks}
                />
            ) : (
                // Mobile Navbar
               <MobileNav
                  menuLinks = {menuLinks}
                  activeSection ={activeSection}
                  isAvatarToggled = {isAvatarToggled}
                  setIsAvatarToggled = {setIsAvatarToggled}
                  scrollToSection = {scrollToSection}
                  isMobileMenuOpen = {isMobileMenuOpen}
                  setIsMobileMenuOpen={setIsMobileMenuOpen}
                  showMenuLinks ={showMenuLinks}
                  userNavLinks = {userNavLinks}
               />
            )
            }
            </motion.nav> 
  )
}

export default Navbar