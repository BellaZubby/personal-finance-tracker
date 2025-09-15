"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { NavProps } from "@/app/shared/types";
import { RootState } from "@/app/store";
import { useSelector } from "react-redux";
import UserAvatar from "../UserAvatar";
import { usePathname } from "next/navigation";
import { useLogoutHandler } from "@/app/shared/useLogoutHandler";

const DesktopNav = ({
  activeSection,
  isAvatarToggled,
  setIsAvatarToggled,
  scrollToSection,
  menuLinks,
  showMenuLinks,
  userNavLinks,
}: NavProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const pathname = usePathname();
  const handleLogout = useLogoutHandler();

  useEffect(() => {
    setIsAvatarToggled(false);
  }, [pathname, setIsAvatarToggled]);

  return (
    <div className="flex items-center justify-between">
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

      {/* Nav Menu */}
      {showMenuLinks && (
        <ul className="flex gap-6">
          {menuLinks.map((item) => (
            <li
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`cursor-pointer transition-colors duration-300 ease-in-out ${
                activeSection === item.id ? "text-amber font-semibold" : ""
              } hover:text-amber`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      {/* Right Side: Login or User Avatar */}
      {!isAuthenticated ? (
        <Link href="/signin">
          <button className="bg-sunPurple text-white px-4 py-2 rounded hover:bg-amber transition cursor-pointer duration-300 ease-in-out">
            Login
          </button>
        </Link>
      ) : (
        <div className="relative">
          {/* Initials Avatar */}
          <div
            onClick={() => setIsAvatarToggled(!isAvatarToggled)}
            className={`text-white rounded-full w-10 h-10 flex items-center bg-sunPurple justify-center cursor-pointer`}
          >
            <UserAvatar />
          </div>

          {/* Dropdown Menu */}
          {isAvatarToggled && (
            <div className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded z-10">
              {userNavLinks.map((link, index) =>
                link.href ? (
                  <div key={index}>
                    <Link href={link.href}>
                      <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        {link.label}
                      </div>
                    </Link>
                  </div>
                ) : (
                  <button
                    key={index}
                    onClick={handleLogout}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer w-full text-left"
                  >
                    {link.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopNav;
