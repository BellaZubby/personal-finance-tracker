import Link from "next/link";
import { FeatureCardProps } from "../shared/types";

const FeatureCard = ({ icon: Icon, title, description, buttonText, route }: FeatureCardProps) => (
  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow duration-300 group font-inter">
    <div className="mb-4">
        <Icon className="w-10 h-10 text-center text-amber"/>
    </div>
    <h3 className="text-xl font-bold mb-2 text-sunPurple">{title}</h3>
    <p className="text-textColor mb-4">{description}</p>
    <Link href={route}>
         <button
    //   onClick={onClick}
      className="bg-sunPurple font-inter group-hover:bg-amber text-amber cursor-pointer group-hover:text-textColor px-4 py-2 rounded-full transition-colors font-bold duration-500 ease-in-out"
    >
      {buttonText}
    </button>
    </Link>
   
  </div>
);

export default FeatureCard