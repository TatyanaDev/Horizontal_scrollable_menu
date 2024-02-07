import { useRef } from "react";
import { useHelperScrollingServices, useScrollingServices } from "../../hooks";
import { scrollHandler, scrollLeft, scrollRight } from "../../helpers";
import { HEIGHT_TITLES_BLOCK, services } from "../../constants";
import "./styles.css";

interface Service {
  title: string;
  description: string;
}

const ScrollableMenu = () => {
  const titlesContainer = useRef<HTMLDivElement>(null);
  const rightArrow = useRef<HTMLDivElement>(null);
  const leftArrow = useRef<HTMLDivElement>(null);

  useScrollingServices(leftArrow, scrollHandler, HEIGHT_TITLES_BLOCK);

  useHelperScrollingServices();

  return (
    <>
      <div
        className="scrolling-right"
        onClick={(event) => scrollRight(event, titlesContainer, leftArrow, rightArrow)}
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
        onClick={(event) => scrollLeft(event, titlesContainer, leftArrow, rightArrow)}
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
