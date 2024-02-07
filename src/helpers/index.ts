import { MouseEvent, RefObject } from "react";
import { MARGIN_BOTTOM, SCROLL_STEP_SIZE, TIMEOUT_DELAY } from "../constants";

export const setActiveTitlePosition = (timeoutId: number): void => {
  const activeElement = document.querySelector<HTMLDivElement>(".titles > * > .active");
  const titlesBlock = document.querySelector<HTMLDivElement>(".titles > *");
  
  if (!activeElement || !titlesBlock) {
    return;
  }

  const titlesBlockPosition = titlesBlock.getBoundingClientRect().left;
  const activePosition = activeElement.getBoundingClientRect().left;
  const currentPosition = titlesBlock.scrollLeft;

  titlesBlock.scrollTo({
    left: activePosition - titlesBlockPosition + currentPosition,
    behavior: "smooth",
  });

  clearTimeout(timeoutId);
};

export const scrollHandler = () => {
  const titlesElem: HTMLDivElement | null = document?.querySelector(".titles");
  const lastButton: any = document?.querySelector(".titles > *")?.lastElementChild;
  const activeElem: HTMLDivElement | null | undefined = titlesElem?.querySelector(".active");
  const leftArrow: HTMLDivElement | null = document?.querySelector(".scrolling-right");
  const rightArrow: HTMLDivElement | null = document?.querySelector(".scrolling-left");

  const titlesBottom = titlesElem && titlesElem.getBoundingClientRect().bottom + MARGIN_BOTTOM;

  if (!activeElem) {
    return;
  }

  const selectedId = activeElem.dataset.id;

  const selected = {
    id: selectedId,
    position: 0,
  };

  if (selectedId && parseInt(selectedId) === 0 && leftArrow) {
    leftArrow.style.display = "none";
  } else if (leftArrow) {
    leftArrow.style.display = "block";
  }

  if (selectedId && parseInt(selectedId) === lastButton.dataset.id && rightArrow) {
    rightArrow.style.display = "none";
  } else if (rightArrow) {
    rightArrow.style.display = "block";
  }

  const scrollObserver = (entries: IntersectionObserverEntry[]) => {
    const documentAtBottom = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
    const idsInView: string[] = [];

    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        idsInView.push((entry.target as any).dataset.id);
      }
    });

    if (documentAtBottom && idsInView.length) {
      document?.querySelector(`.titles > * > .active`)?.classList.remove("active");
      document?.querySelector(`.titles > * > [data-id="${idsInView[0]}"]`)?.classList.add("active");

      const timeoutId = window.setTimeout(() => setActiveTitlePosition(timeoutId), TIMEOUT_DELAY);
    }
  };

  const observer = new IntersectionObserver(scrollObserver, { threshold: 1.0 });

  document?.querySelectorAll(".blocks > *").forEach((elem: Element) => {
    const position: any = titlesBottom && elem?.getBoundingClientRect().top - titlesBottom;

    observer.observe(elem);

    if (position < MARGIN_BOTTOM) {
      selected.id = (elem as HTMLElement).dataset.id;
      selected.position = position;
    }
  });

  if (selectedId !== selected.id) {
    document?.querySelector(`.titles > * > .active`)?.classList.remove("active");
    document?.querySelector(`.titles > * > [data-id="${selected.id}"]`)?.classList.add("active");

    const timeoutId = window.setTimeout(() => setActiveTitlePosition(timeoutId), TIMEOUT_DELAY);
  }
};

export const scrollLeft = (event: MouseEvent<HTMLDivElement>, titlesContainer: RefObject<HTMLDivElement>, leftArrow: RefObject<HTMLDivElement>, rightArrow: RefObject<HTMLDivElement>): void => {
  event.preventDefault();

  handleScroll(titlesContainer, leftArrow, rightArrow, SCROLL_STEP_SIZE);
};

export const scrollRight = (event: MouseEvent<HTMLDivElement>, titlesContainer: RefObject<HTMLDivElement>, leftArrow: RefObject<HTMLDivElement>, rightArrow: RefObject<HTMLDivElement>): void => {
  event.preventDefault();

  handleScroll(titlesContainer, leftArrow, rightArrow, -SCROLL_STEP_SIZE);
};

function handleScroll(titlesContainer: RefObject<HTMLDivElement>, leftArrow: RefObject<HTMLDivElement>, rightArrow: RefObject<HTMLDivElement>, stepSize: number): void {
  const container = titlesContainer.current;

  if (!container) {
    return;
  }

  container.scrollLeft += stepSize;

  const atStart = container.scrollLeft <= 0;
  const atEnd = container.scrollLeft + container.offsetWidth >= container.scrollWidth;

  leftArrow.current!.style.display = atStart ? "none" : "block";
  rightArrow.current!.style.display = atEnd ? "none" : "block";
}