import { useLocation } from "react-router";
import { useRef } from "react";
import {
  scrollHandler,
  scrollLeft,
  scrollRight,
  setActiveTitlePosition,
} from "../../helpers";
import { HEIGHT_TITLES_BLOCK, services } from "../../constants";
import useScrollingServices from "../../hook";
import "./styles.css";

interface Service {
  title: string;
  description: string;
}

const ScrollableMenu = () => {
  const titlesContainer = useRef<HTMLDivElement>(null);
  const rightArrow = useRef<HTMLDivElement>(null);
  const leftArrow = useRef<HTMLDivElement>(null);

  const location = useLocation();

  const activeServiceBlock = {
    id: location.state?.activeTitle || 0,
    position: 0,
  };

  useScrollingServices(leftArrow, scrollHandler, location, HEIGHT_TITLES_BLOCK);

  document?.querySelectorAll(".blocks > *").forEach((elem: Element) => {
    const headerBottom = document?.querySelector(".titles");

    if (headerBottom) {
      const position =
        elem?.getBoundingClientRect().top -
        headerBottom.getBoundingClientRect().bottom +
        HEIGHT_TITLES_BLOCK;

      if (position < HEIGHT_TITLES_BLOCK) {
        activeServiceBlock.id = Number((elem as HTMLElement).dataset.id);
        activeServiceBlock.position = position;
      }
    }
  });

  document?.querySelector(`.titles > * > .active`)?.classList.remove("active");
  document
    ?.querySelector(`.titles > * > [data-id="${activeServiceBlock.id}"]`)
    ?.classList.add("active");

  const timeoutId = window.setTimeout(
    () => setActiveTitlePosition(timeoutId),
    50
  );

  document
    ?.querySelector(".titles")
    ?.addEventListener("click", (event: any) => {
      event.preventDefault();

      const id = event.target?.dataset.id;

      if (id) {
        document
          ?.querySelector(`.titles > * > .active`)
          ?.classList.remove("active");
        document
          ?.querySelector(`.titles > * > [data-id="${id}"]`)
          ?.classList.add("active");

        const pagePosition = window.scrollY;
        const activeTopPosition: number | undefined = document
          ?.querySelector(`.blocks [data-id="${id}"]`)
          ?.getBoundingClientRect().top;
        const titlesElem: HTMLDivElement | null =
          document?.querySelector(".titles");
        const titlesBottomLinePosition: number | null =
          titlesElem &&
          titlesElem?.getBoundingClientRect().bottom -
            (titlesElem?.getBoundingClientRect().bottom -
              titlesElem.clientHeight);

        if (activeTopPosition && titlesBottomLinePosition) {
          window?.scrollTo({
            top:
              activeTopPosition +
              pagePosition -
              (titlesBottomLinePosition + HEIGHT_TITLES_BLOCK),
            behavior: "smooth",
          });
        }
      }
    });

  return (
    <>
      <div
        className="scrolling-right"
        onClick={(event) =>
          scrollRight(event, titlesContainer, leftArrow, rightArrow)
        }
        ref={leftArrow}
      >
        <p>&#x2BC7;</p>
      </div>

      <div className="titles">
        <div ref={titlesContainer}>
          {services.map((service: Service, idx: number) => (
            <button data-id={`${idx}`} key={idx}>
              {service.title}
            </button>
          ))}
        </div>
      </div>

      <div
        className="scrolling-left"
        onClick={(event) =>
          scrollLeft(event, titlesContainer, leftArrow, rightArrow)
        }
        
        ref={rightArrow}
      >
        <p>&#x2BC8;</p>
      </div>

      <div className="blocks">
        {services?.map((service: Service, idx: number) => (
          <div data-id={`${idx}`} key={idx}>
            <h1 className="title">{service.title}</h1>

            <p className="description">{service.description}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ScrollableMenu;
