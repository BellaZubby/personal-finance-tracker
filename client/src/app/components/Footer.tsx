import Link from "next/link";
import { Socials } from "../shared/types";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-2 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 md:items-center">
        {/* Left: Brand Message */}
        {/* Logo */}
        <Link className="flex items-center" href="/">
          <Image
            src={"https://res.cloudinary.com/dxveggtpi/image/upload/q_auto,f_auto/LogoMakr-2ziVYh_co1n4b.ico"}
            alt="Akulyst-logo"
            width={80}
            height={80}
          />
          <span className="uppercase font-extrabold text-white text-2xl hover:text-rockies transition duration-300 ease-in-out">
            Akulyst
          </span>
        </Link>

        {/* Right: Social + Copyright */}
        <div className="flex flex-col md:items-end space-y-3">
          <div className="flex space-x-4 justify-center md:justify-end">
            {Socials.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <social.icon className="md:w-6 md:h-6 transition-colors text-white hover:text-amber duration-300 ease-in-out" />
              </Link>
            ))}
          </div>
          <p className="text-sm text-white/70 text-center">
            © {new Date().getFullYear()} Akulyst. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
