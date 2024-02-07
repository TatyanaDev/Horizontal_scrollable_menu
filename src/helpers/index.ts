import { MouseEvent, RefObject } from "react";
import { MARGIN_BOTTOM, SCROLL_STEP_SIZE, TIMEOUT_DELAY } from "../constants";

export const setActiveTitlePosition = (timeoutId: number) => {
  const activePosition: any = document?.querySelector(".titles > * > .active")?.getBoundingClientRect().left;
  const titlesBlockPosition: any = document?.querySelector(".titles > *")?.getBoundingClientRect().left;
  const currentPosition: any = document?.querySelector(".titles > *")?.scrollLeft;

  document.querySelector(".titles > *")?.scrollTo({
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

export const scrollLeft = (event: MouseEvent<HTMLDivElement>, titlesContainer: RefObject<HTMLElement>, leftArrow: RefObject<HTMLElement>, rightArrow: RefObject<HTMLElement>) => {
  event.preventDefault();

  if (titlesContainer?.current && leftArrow.current) {
    leftArrow.current.style.display = "block";
    titlesContainer.current.scrollLeft += SCROLL_STEP_SIZE;

    const remainder = (titlesContainer.current.scrollWidth - titlesContainer.current.offsetWidth) % SCROLL_STEP_SIZE;

    if (rightArrow.current && titlesContainer.current.scrollLeft >= titlesContainer.current.scrollWidth - titlesContainer.current.offsetWidth - remainder) {
      rightArrow.current.style.display = "none";
    }
  }
};

export const scrollRight = (event: MouseEvent<HTMLDivElement>, titlesContainer: RefObject<HTMLElement>, leftArrow: RefObject<HTMLElement>, rightArrow: RefObject<HTMLElement>) => {
  event.preventDefault();

  if (titlesContainer.current && rightArrow.current) {
    rightArrow.current.style.display = "block";
    titlesContainer.current.scrollLeft -= SCROLL_STEP_SIZE;

    if (leftArrow.current && titlesContainer.current.scrollLeft <= SCROLL_STEP_SIZE) {
      leftArrow.current.style.display = "none";
    }
  }
};
