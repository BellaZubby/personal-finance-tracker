"use client";
import { MobileNavProps } from "@/app/shared/types";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React, { useEffect } from "react";
import Image from "next/image";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";
import { usePathname } from "next/navigation";
import { useLogoutHandler } from "@/app/shared/useLogoutHandler";

const MobileNav = ({
  activeSection,
  isAvatarToggled,
  setIsAvatarToggled,
  scrollToSection,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  menuLinks,
  showMenuLinks,
  userNavLinks,
}: MobileNavProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const pathname = usePathname();
  const handleLogout = useLogoutHandler();

  useEffect(() => {
    setIsAvatarToggled(false);
  }, [pathname, setIsAvatarToggled]);

  return (
    <div className="flex items-center justify-between lg:hidden">
      {/* Logo */}
      <Link className="flex items-center justify-center" href="/">
        <Image
          src={"/akulyst-logo.png"}
          alt="Akulyst-logo"
          width={80}
          height={80}
        />
        <span className="uppercase font-extrabold text-sunPurple text-2xl">
          Akulyst
        </span>
      </Link>

      {/* bar and profile */}
      <div className="flex items-center justify-center gap-5">
        {isAuthenticated && (
          <div className="relative">
            {/* Initials Avatar */}
            <div
              onClick={() => setIsAvatarToggled(!isAvatarToggled)}
              className={`text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer bg-sunPurple`}
            >
              <UserAvatar />
            </div>

            {/* Dropdown Menu */}
            {isAvatarToggled && (
              <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded z-10">
                {userNavLinks.map((link, index) =>
                  link.href ? (
                    <Link key={index} href={link.href}>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {link.label}
                      </div>
                    </Link>
                  ) : (
                    <button
                      key={index}
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* profile if user */}
        {/* Mobile Hamburger */}
        {showMenuLinks && (
          <>
            <div>
              <button onClick={() => setIsMobileMenuOpen((prev) => !prev)}>
                {!isMobileMenuOpen ? (
                  <svg
                    className="w-10 h-10 text-sunPurple"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="w-10 h-10 text-sunPurple"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* mobile menulinks */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-full left-0 w-full bg-white shadow-md"
                >
                  <ul className="flex flex-col items-center py-4 gap-4">
                    {menuLinks.map((item) => (
                      <li
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`cursor-pointer ${
                          activeSection === item.id
                            ? "text-amber font-semibold"
                            : ""
                        }`}
                      >
                        {item.label}
                      </li>
                    ))}
                    {!isAuthenticated && (
                      <Link href={"/signin"}>
                        <button className="bg-sunPurple text-white px-4 py-2 rounded hover:bg-hallmark transition">
                          Login
                        </button>
                      </Link>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
};

export default MobileNav;
