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
          className="fixed bottom-7 right-7 cursor-pointer bg-surface border border-border shadow-lg p-2 rounded-full hover:bg-surface-hover transition-colors"
        >
          <Icon name="PiCaretUp" className="animate-pulse text-text-primary" />
        </div>
      )}
    </>
  );
};
