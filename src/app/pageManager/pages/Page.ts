import { globalState } from "../../globalState";

export interface AnimateExit {
  fromEl: HTMLElement;
  toEl: HTMLElement;
  fromId: string;
  toId: string;
  trigger: string | HTMLAnchorElement;
}

export class Page {
  constructor() {
    this._addListeners();
  }

  _addListeners() {
    globalState.eventDispatcher.addEventListener(
      "onPageChangeStart",
      this.onPageChangeStart
    );
  }

  onPageChangeStart = (e: CustomEvent) => {
    const { from, to, trigger } = e as any;

    const fromEl = document.body.querySelector(from) as HTMLElement;
    const toEl = document.body.querySelector(to) as HTMLElement;

    const fromId = fromEl.dataset.pageName;
    const toId = toEl.dataset.pageName;

    if (!fromId || !toId) return console.error("No fromId or toId");

    this.animateExit({ fromEl, toEl, fromId, toId, trigger });
  };

  animateExit(props: AnimateExit) {}
}
