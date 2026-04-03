import { useEffect, useState } from "react";

export function useIsMobile(breakpoint = 960) {
  const mediaQuery = `(max-width: ${breakpoint}px)`;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(mediaQuery).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mql = window.matchMedia(mediaQuery);
    const onChange = (event) => setIsMobile(event.matches);

    setIsMobile(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mediaQuery]);

  return isMobile;
}
