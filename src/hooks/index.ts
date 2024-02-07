import { RefObject, useEffect } from "react";
import { useLocation } from "react-router";
import { scrollToActiveTitle, setActiveTitlePosition } from "../helpers";
import { HEIGHT_TITLES_BLOCK, TIMEOUT_DELAY } from "../constants";

export const useScrollingServices = (leftArrow: RefObject<HTMLDivElement>, scrollHandler: (timestamp: number) => void, HEIGHT_TITLES_BLOCK: number) => {
  const location = useLocation();

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
};

export const useHelperScrollingServices = () => {
  const location = useLocation();

  useEffect(() => {
    const activeServiceBlock = {
      id: location.state?.activeTitle || 0,
      position: 0,
    };

    document?.querySelectorAll(".blocks > *").forEach((elem: Element) => {
      const headerBottom = document?.querySelector(".titles");

      if (headerBottom) {
        const position = elem?.getBoundingClientRect().top - headerBottom.getBoundingClientRect().bottom + HEIGHT_TITLES_BLOCK;

        if (position < HEIGHT_TITLES_BLOCK) {
          activeServiceBlock.id = Number((elem as HTMLElement).dataset.id);
          activeServiceBlock.position = position;
        }
      }
    });

    document?.querySelector(`.titles > * > .active`)?.classList.remove("active");
    document?.querySelector(`.titles > * > [data-id="${activeServiceBlock.id}"]`)?.classList.add("active");

    const timeoutId = window.setTimeout(() => setActiveTitlePosition(timeoutId), TIMEOUT_DELAY);

    document?.querySelector(".titles")?.addEventListener("click", (event: any) => {
      event.preventDefault();

      const id = event.target?.dataset.id;

      if (id) {
        document.querySelector(`.titles > * > .active`)?.classList.remove("active");
        document.querySelector(`.titles > * > [data-id="${id}"]`)?.classList.add("active");

        scrollToActiveTitle(id);
      }
    });
  }, [location.state?.activeTitle]);
};
