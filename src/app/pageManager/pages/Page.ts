import { globalState } from "../../globalState";
import { Paragraph } from "../../utils/Paragraph";

export interface AnimateExit {
  fromEl: HTMLElement;
  toEl: HTMLElement;
  fromId: string;
  toId: string;
  trigger: string | HTMLAnchorElement;
  resolveFn: () => void;
}

export interface AnimateEnter {
  el: HTMLElement;
  pageId: string;
  comingFromId: string;
}

export class Page {
  _animatedParagraphs: Paragraph[] = [];

  constructor() {
    this._addListeners();
  }

  _addListeners() {
    globalState.eventDispatcher.addEventListener(
      "onPageLeave",
      this.onPageLeave
    );

    globalState.eventDispatcher.addEventListener(
      "onPageEnter",
      this.onPageEnter
    );
  }

  onPageLeave = (e: CustomEvent) => {
    const { from, to, trigger, resolveFn } = e as any;

    const fromEl = document.body.querySelector(from) as HTMLElement;
    const toEl = document.body.querySelector(to) as HTMLElement;

    const fromId = fromEl.dataset.transitionPageName;
    const toId = toEl.dataset.transitionPageName;

    if (!fromId || !toId) return console.error("No fromId or toId");

    this.animateExit({ fromEl, toEl, fromId, toId, trigger, resolveFn });
  };

  onPageEnter = (e: CustomEvent) => {
    const { pageId, comingFrom } = e as any;

    const el = document.body.querySelector(pageId) as HTMLElement;
    const elId = el.dataset.transitionPageName;

    if (!elId) return console.error("No elId");

    this.animateEnter({ el, pageId: elId, comingFromId: comingFrom });
  };

  animateExit(props: AnimateExit) {}

  animateEnter(props: AnimateEnter) {}

  onResize() {
    this._animatedParagraphs.forEach((p) => p.onResize());
  }
}
