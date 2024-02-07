import { MouseEvent, RefObject } from "react";
import { HEIGHT_TITLES_BLOCK, MARGIN_BOTTOM, SCROLL_STEP_SIZE, TIMEOUT_DELAY } from "../constants";

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
  const lastButton: HTMLElement | null = document?.querySelector(".titles > *:last-child")
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

  if (selectedId && lastButton && lastButton.dataset.id && parseInt(selectedId) === parseInt(lastButton.dataset.id) && rightArrow) {
    rightArrow.style.display = "none";
  } else if (rightArrow) {
    rightArrow.style.display = "block";
  }

  const scrollObserver = (entries: IntersectionObserverEntry[]) => {
    const documentAtBottom = document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
    const idsInView: string[] = [];

    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        const id = (entry.target as HTMLElement).dataset.id;

        if (id) {
          idsInView.push(id);
        }
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
    let position

    if (titlesBottom && elem) {
      position = elem.getBoundingClientRect().top - titlesBottom;
      observer.observe(elem);
  
      if (position < MARGIN_BOTTOM) {
        selected.id = (elem as HTMLElement).dataset.id;
        selected.position = position;
      }
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

export const scrollToActiveTitle = (id: string) => {
  const activeTitleElement = document.querySelector<HTMLDivElement>(`.blocks [data-id="${id}"]`);
  const titlesElement = document.querySelector<HTMLDivElement>(".titles");

  if (activeTitleElement && titlesElement) {
    const titlesBottomLinePosition = titlesElement.getBoundingClientRect().bottom - titlesElement.clientHeight;
    const activeTopPosition = activeTitleElement.getBoundingClientRect().top;

    window.scrollTo({
      top: window.scrollY + activeTopPosition - titlesBottomLinePosition - HEIGHT_TITLES_BLOCK,
      behavior: "smooth",
    });
  }
};