import Image from "next/image";
import LandingPage from "./(pages)/LandingPage";
import { generateRandomColor } from "./utils/generateRandomColor";

export default function Home() {
  return (
    <div className="">
     <LandingPage/>
    </div>
  );
}
