import {
  FaChartPie,
  FaMoneyBillWave,
  FaTwitter,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
  FaEnvelope,
  FaFacebook,
} from "react-icons/fa";
import { IconType } from "react-icons";
import { FaLightbulb } from "react-icons/fa6";

export enum SelectedPage {
  Home = "home",
  About = "about",
  Features = "features",
  HowItWorks = "howItWorks",
  FAQ = "faq",
}

// define types for navbar menu
interface Menu {
  label: string;
  id: string;
}

// define the contents of the menu in an array
export const menuLinks: Menu[] = [
  {
    label: "Home",
    id: "hero",
  },
  {
    label: "About",
    id: "about",
  },
  {
    label: "Features",
    id: "features",
  },
  {
    label: "How it Works",
    id: "how_it_works",
  },
  {
    label: "FAQ",
    id: "faq",
  },
];

// USERS PROFILE NAVIGATION
interface UserNavLinks {
  label: string;
  href?: string;
}

export const userNavLinks: UserNavLinks[] = [
  {
    label: "Profile",
    href: "/profile",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Logout",
  },
];

export type UserType = {
  firstName: string;
  lastName: string;
  isLoggedIn: boolean;
  color: string;
};

export interface NavProps {
  activeSection: string;
  // user: UserType | null
  isAvatarToggled: boolean;
  setIsAvatarToggled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToSection: (id: string) => void;
  menuLinks: Menu[];
  showMenuLinks: boolean;
  userNavLinks: UserNavLinks[];
}

export interface MobileNavProps extends NavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// FEATURES
export type FeatureCardProps = {
  icon: IconType;
  title: string;
  description: string;
  buttonText: string;
  route: string;
};

export const featureData = [
  {
    id: 1,
    icon: FaChartPie,
    title: "Monthly Budget Setup",
    description:
      "Define spending limits across categories like Food, Transport, and Entertainment.",
    buttonText: "Set Your Budget",
    route: "/budget",
  },
  {
    id: 2,
    icon: FaMoneyBillWave,
    title: "Daily Expense Logging",
    description:
      "Track your daily expenses with category, amount, date, and notes.",
    buttonText: "Log an Expense",
    route: "/expense",
  },
  {
    id: 3,
    icon: FaLightbulb,
    title: "Smart Spending Insights",
    description:
      "Get personalized feedback and suggestions based on your spending habits.",
    buttonText: "View Insights",
    route: "/dashboard",
  },
];

// HOW IT WORKS
export type howItWorksProps = {
  title: string;
  description: string;
};

export const steps: howItWorksProps[] = [
  {
    title: "1. Create an Account",
    description:
      "Sign up in seconds and unlock access to your personalized financial dashboard.",
  },
  {
    title: "2. Set Your Budget",
    description:
      "Plan your spending over 7 to 30 days and take control of your financial flow.",
  },
  {
    title: "3. Track Your Expenses",
    description: "Capture every expense by category, amount, and notes.",
  },
  {
    title: "5. Monitor Your Dashboard",
    description:
      "Visualize your financial health with real-time charts and progress indicators.",
  },
  {
    title: "6. Get Personalized Insights",
    description:
      "Discover tailored suggestions based on your spending patterns and progress.",
  },
];

type faqsProps = {
  answer: string;
  question: string;
};

// FAQs
export const faqs: faqsProps[] = [
  {
    question: "Is Akulyst free to use?",
    answer: "Yes — Akulyst is entirely free to use",
  },
  {
    question: "How does Akulyst track my expenses?",
    answer:
      "Akulyst lets you log daily expenses by category, amount, and notes. It then visualizes your spending trends in real time.",
  },
  {
    question: "Can I monitor my budget progress?",
    answer:
      "Yes — Akulyst tracks your budget usage over time and provides insights like health scores, behavior flags, and suggestions to guide your decisions.",
  },
  {
    question: "How does Akulyst help me stay on budget?",
    answer:
      "Akulyst tracks your spending against category limits and alerts you when you're approaching or exceeding your budget. It also provides suggestions to help you adjust and stay on track.",
  },
];

// Footer-Socials
type socials = {
  icon: IconType;
  href: string;
};

export const Socials: socials[] = [
  {
    icon: FaLinkedin,
    href: "#",
  },
  {
    icon: FaEnvelope,
    href: "#",
  },
  {
    icon: FaInstagram,
    href: "#",
  },
  {
    icon: FaTwitter,
    href: "#",
  },
  {
    icon: FaFacebook,
    href: "#",
  },
  {
    icon: FaTiktok,
    href: "#",
  },
];

export interface APIError {
  data?: {
    message?: string;
  };
}

export interface OTPError {
  data?: {
    message?: string;
    code?: string;
  };
}
