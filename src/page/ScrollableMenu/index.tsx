import { MouseEvent, useRef } from "react";
import { useHelperScrollingServices, useScrollingServices } from "../../hooks";
import { scrollHandler, scrollLeft, scrollRight } from "../../helpers";
import { HEIGHT_TITLES_BLOCK } from "../../constants";
import Content from "../../components/Content";
import Header from "../../components/Header";
import Arrow from "../../components/Arrow";

const ScrollableMenu = () => {
  const titlesContainerRef = useRef<HTMLDivElement>(null);
  const rightArrowRef = useRef<HTMLDivElement>(null);
  const leftArrowRef = useRef<HTMLDivElement>(null);

  useScrollingServices(leftArrowRef, scrollHandler, HEIGHT_TITLES_BLOCK);

  useHelperScrollingServices();

  const onClickRight = (event: MouseEvent<HTMLDivElement>) => scrollRight(event, titlesContainerRef, leftArrowRef, rightArrowRef);

  const onClickLeft = (event: MouseEvent<HTMLDivElement>) => scrollLeft(event, titlesContainerRef, leftArrowRef, rightArrowRef);

  return (
    <>
      <Arrow
        nameOfClass="scrolling-right"
        onClick={onClickRight}
        hookRef={leftArrowRef}
        arrowSign="&#x2BC7;"
      />

      <Header titlesContainerRef={titlesContainerRef} />

      <Arrow
        nameOfClass="scrolling-left"
        onClick={onClickLeft}
        hookRef={rightArrowRef}
        arrowSign="&#x2BC8;"
      />

      <Content />
    </>
  );
};

export default ScrollableMenu;
