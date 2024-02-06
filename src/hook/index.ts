import { RefObject, useEffect } from "react";
import { Location } from "react-router";

const useScrollingServices = (
  leftArrow: RefObject<HTMLDivElement>,
  scrollHandler: (event: number) => void,
  location: Location,
  HEIGHT_TITLES_BLOCK: number
) =>
  useEffect(() => {
    if (leftArrow.current) {
      leftArrow.current.style.display = "none";
    }

    const scrollHelper = () => {
      let scrolling = false;

      if (!scrolling) {
        window.requestAnimationFrame((event) => {
          scrollHandler(event);

          scrolling = false;
        });

        scrolling = true;
      }
    };

    const pagePosition = window.scrollY;
    const activeTopPosition: number | undefined = document
      ?.querySelector(`.blocks [data-id="${location.state?.activeTitle}"]`)
      ?.getBoundingClientRect().top;
    const titlesElem: HTMLDivElement | null =
      document?.querySelector(".titles");
    const titlesBottomLinePosition: number | null =
      titlesElem &&
      titlesElem?.getBoundingClientRect().bottom -
        (titlesElem?.getBoundingClientRect().bottom - titlesElem.clientHeight);

    if (activeTopPosition && titlesBottomLinePosition) {
      window?.scrollTo({
        top:
          activeTopPosition +
          pagePosition -
          (titlesBottomLinePosition + HEIGHT_TITLES_BLOCK),
        behavior: "smooth",
      });
    }

    window.addEventListener("scroll", scrollHelper);

    return () => window.removeEventListener("scroll", scrollHelper);
  }, [HEIGHT_TITLES_BLOCK, leftArrow, location.state, scrollHandler]);

export default useScrollingServices;
