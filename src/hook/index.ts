import { RefObject, useEffect } from "react";
import { Location } from "react-router";
import { HEIGHT_SCROLL_TOP } from "../constants";

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

    const scrollToActiveTitle = () => {
      const activeTitleElement = document.querySelector<HTMLDivElement>(`.blocks [data-id="${location.state?.activeTitle}"]`);
      const titlesElement = document.querySelector<HTMLDivElement>(".titles");

      if (activeTitleElement && titlesElement) {
        const titlesBottomLinePosition = titlesElement.getBoundingClientRect().bottom - titlesElement.clientHeight;
        const activeTopPosition = activeTitleElement.getBoundingClientRect().top;

        window.scrollTo({
          top: window.scrollY + activeTopPosition - titlesBottomLinePosition - HEIGHT_TITLES_BLOCK + HEIGHT_SCROLL_TOP,
          behavior: "smooth",
        });
      }
    };

    scrollToActiveTitle();

    window.addEventListener("scroll", throttledScrollHandler);

    return () => {
      window.removeEventListener("scroll", throttledScrollHandler);

      if (lastRafId) {
        window.cancelAnimationFrame(lastRafId);
      }
    };
  }, [leftArrow, scrollHandler, location.state, HEIGHT_TITLES_BLOCK]);

export default useScrollingServices;
