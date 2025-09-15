"use client";

import { useEffect, useState } from "react";

// setting up responsiveness
/**
 * define custom hook - useMediaQuery that takes in one argument, the query which is of type "string"
 * @param query - which is a media query string (e.g, "(max-width: 768px)").
 */
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  /**
   * This effect runs after the component mounts and whenever matches or query changes.
   */
  useEffect(() => {
    // Uses the browser’s matchMedia API to evaluate the media query.
    const media = window.matchMedia(query); // media is a MediaQueryList object that tells you if the query currently matches.
    if (media.matches !== matches) {
      // checks if the current match is different from the stored match
      setMatches(media.matches); // if it is, it updates match to the current match.
    }
    const listener = () => setMatches(media.matches); // Defines a listener function that updates matches whenever the screen size chnages
    window.addEventListener("resize", listener); // we call the function whenever the "resize" event occurs i.e when screen size changes.

    /**
     * we define the cleanup function
     * removes the event listener when the component unmounts or dependencies change, preventing memory leaks.
     */
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);

  /**
   * - the hook returns the current match status
   * - Components using this hook will get a true or false value depending on whether the media query matches
   */
  return matches;
};

export default useMediaQuery; // makes it available to other files for use.
