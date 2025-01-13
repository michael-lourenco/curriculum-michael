"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";


export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const toggleVisibility = () => {
        setIsVisible(window.scrollY > 400);
      };

      window.addEventListener("scroll", toggleVisibility);
      return () => window.removeEventListener("scroll", toggleVisibility);
    }
  }, []);

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          className="fixed bottom-7 right-7 cursor-pointer bg-background shadow-lg shadow-neutral-200 dark:shadow-neutral-700  p-2 rounded-full"
        >
          <Icon name="PiCaretUp" className="animate-pulse" />
        </div>
      )}
    </>
  );
};
