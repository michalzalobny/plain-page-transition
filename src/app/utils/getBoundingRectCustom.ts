import { DomRectSSR, emptySSRRect } from "./types";

//Used because normally, it's impossible to override the properties of a DOMRect
export const getBoundingRectCustom = (el: HTMLElement): DomRectSSR => {
  if (!el) {
    console.warn("getBoundingRectCustom: el is null");
    return emptySSRRect;
  }
  const rect = el.getBoundingClientRect();
  const { top, left, width, height, bottom, right, x, y } = rect;

  const copiedRect = { ...emptySSRRect };

  copiedRect.top = top;
  copiedRect.left = left;
  copiedRect.width = width;
  copiedRect.height = height;
  copiedRect.bottom = bottom;
  copiedRect.right = right;
  copiedRect.x = x;
  copiedRect.y = y;

  return copiedRect;
};
