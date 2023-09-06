export const findCurrentTarget = (e: Event) => {
  let target = e.target as HTMLElement;
  let currentTarget: HTMLAnchorElement | null = null;

  while (target && target !== document.body) {
    if (target.tagName === "A") {
      currentTarget = target as HTMLAnchorElement;
      break;
    }
    const parentEl = target.parentElement;
    if (parentEl) target = parentEl;
  }

  return currentTarget;
};
