import { MouseEvent } from 'react';

export const setActiveTitlePosition = (timeoutId: number) => {
  const activePosition: any = document?.querySelector('.titles > * > .active')?.getBoundingClientRect().left;
  const titlesBlockPosition: any = document?.querySelector('.titles > *')?.getBoundingClientRect().left;
  const currentPosition: any = document?.querySelector('.titles > *')?.scrollLeft;

  document.querySelector('.titles > *')?.scrollTo({
    left: activePosition - titlesBlockPosition + currentPosition,
    behavior: 'smooth',
  });

  clearTimeout(timeoutId);
};

export const scrollHandler = () => {
  const titlesElem: HTMLDivElement | null = document?.querySelector('.titles');
  const lastButton: any = document?.querySelector('.titles > *')?.lastElementChild;
  const activeElem: HTMLDivElement | null | undefined = titlesElem?.querySelector('.active');
  const leftArrow: HTMLDivElement | null = document?.querySelector('.scrolling-right');
  const rightArrow: HTMLDivElement | null = document?.querySelector('.scrolling-left');

  const marginBottom = 10;
  const titlesBottom = titlesElem && titlesElem.getBoundingClientRect().bottom + marginBottom;

  if (!activeElem) {
    return;
  }

  const selectedId = activeElem.dataset.id;

  const selected = {
    id: selectedId,
    position: 0,
  };

  if (selectedId && parseInt(selectedId) === 0 && leftArrow) {
    leftArrow.style.display = 'none';
  } else if (leftArrow) {
    leftArrow.style.display = 'block';
  }

  if (selectedId && parseInt(selectedId) === lastButton.dataset.id && rightArrow) {
    rightArrow.style.display = 'none';
  } else if (rightArrow) {
    rightArrow.style.display = 'block';
  }

  const scrollObserver = (entries: IntersectionObserverEntry[]) => {
    const documentAtBottom =
      document.documentElement.scrollTop + window.innerHeight >= document.documentElement.scrollHeight;
    const idsInView: string[] = [];

    entries.forEach((entry: IntersectionObserverEntry) => {
      if (entry.isIntersecting && entry.intersectionRatio === 1) {
        idsInView.push((entry.target as any).dataset.id);
      }
    });

    if (documentAtBottom && idsInView.length) {
      document?.querySelector(`.titles > * > .active`)?.classList.remove('active');
      document?.querySelector(`.titles > * > [data-id="${idsInView[0]}"]`)?.classList.add('active');

      const timeoutId = window.setTimeout(() => setActiveTitlePosition(timeoutId), 50);
    }
  };

  const observer = new IntersectionObserver(scrollObserver, { threshold: 1.0 });

  document?.querySelectorAll('.blocks > *').forEach((elem: Element) => {
    const position: any = titlesBottom && elem?.getBoundingClientRect().top - titlesBottom;
    
    observer.observe(elem);

    if (position < marginBottom) {
      selected.id = (elem as HTMLElement).dataset.id;
      selected.position = position;
    }
  });

  if (selectedId !== selected.id) {
    document?.querySelector(`.titles > * > .active`)?.classList.remove('active');
    document?.querySelector(`.titles > * > [data-id="${selected.id}"]`)?.classList.add('active');

    const timeoutId = window.setTimeout(() => setActiveTitlePosition(timeoutId), 50);
  }
};

const scrollStepSize = 100;

export const scrollLeft = (
  event: MouseEvent<HTMLDivElement>,
  titlesContainer: any,
  leftArrow: any,
  rightArrow: any
) => {
  event.preventDefault();

  if (titlesContainer?.current && leftArrow.current) {
    leftArrow.current.style.display = 'block';
    titlesContainer.current.scrollLeft += scrollStepSize;

    const remainder = (titlesContainer.current.scrollWidth - titlesContainer.current.offsetWidth) % scrollStepSize;

    if (
      rightArrow.current &&
      titlesContainer.current.scrollLeft >=
        titlesContainer.current.scrollWidth - titlesContainer.current.offsetWidth - remainder
    ) {
      rightArrow.current.style.display = 'none';
    }
  }
};

export const scrollRight = (
  event: MouseEvent<HTMLDivElement>,
  titlesContainer: any,
  leftArrow: any,
  rightArrow: any
) => {
  event.preventDefault();

  if (titlesContainer.current && rightArrow.current) {
    rightArrow.current.style.display = 'block';
    titlesContainer.current.scrollLeft -= scrollStepSize;

    if (leftArrow.current && titlesContainer.current.scrollLeft <= scrollStepSize) {
      leftArrow.current.style.display = 'none';
    }
  }
};
