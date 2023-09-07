import SplitType from "split-type";

import { Animation } from "./Animation";

interface Constructor {
  element: HTMLElement;
}

export class Paragraph extends Animation {
  _text: SplitType;

  constructor({ element }: Constructor) {
    super({ element });

    this._text = new SplitType(this._element, {
      tagName: "span",
      types: "lines, words",
    });

    this._element.style.opacity = "1";
  }

  animateIn() {
    super.animateIn();
    if (!this._text.lines) return;

    this._text.lines.forEach((line, lineIndex) => {
      Array.from(line.children).forEach((word) => {
        (
          word as HTMLElement
        ).style.transition = `transform calc(1.6 * var(--t-1)) ${
          lineIndex * 0.16
        }s var(--easing-1)`;
        word.classList.add("word--active");
      });
    });
  }

  animateOut() {
    super.animateOut();

    if (!this._text.lines) return;

    this._text.lines.forEach((line, lineIndex) => {
      Array.from(line.children).forEach((word) => {
        (word as HTMLElement).style.transition = `transform var(--t-1) ${
          lineIndex * 0.1
        }s var(--easing-1)`;
        word.classList.remove("word--active");
      });
    });
  }

  onResize() {
    super.onResize();
    this._text.revert();

    this._text = new SplitType(this._element, {
      tagName: "span",
      types: "lines, words",
    });

    this.animateIn();

    // this.initObserver();
  }

  destroy() {
    super.destroy();
    this._text.revert();
  }
}
