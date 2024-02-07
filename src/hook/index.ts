import { RefObject, useEffect } from "react";
import { Location } from "react-router";
import { scrollToActiveTitle } from "../helpers";

const useScrollingServices = (leftArrow: RefObject<HTMLDivElement>, scrollHandler: (timestamp: number) => void, location: Location, HEIGHT_TITLES_BLOCK: number) =>
  useEffect(() => {
    leftArrow.current?.style.setProperty("display", "none");

    let lastRafId: number | null = null;

    const throttledScrollHandler = () => {
      if (lastRafId === null) {
        lastRafId = window.requestAnimationFrame((timestamp) => {
          scrollHandler(timestamp);
          lastRafId = null;
        });
      }
    };

    scrollToActiveTitle(location.state?.activeTitle);

    window.addEventListener("scroll", throttledScrollHandler);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);

      if (lastRafId) {
        window.cancelAnimationFrame(lastRafId);
      }
    };
  }, [leftArrow, scrollHandler, location.state, HEIGHT_TITLES_BLOCK]);

export default useScrollingServices;
