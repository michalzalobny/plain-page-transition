import { globalState } from "../../globalState";
import { Paragraph } from "../../utils/Paragraph";
import { getTransitionPage } from "./utils/getTransitionPage";
import {
  AnimateEnter,
  AnimateLeave,
  PageTransitionEnterEvent,
  PageTransitionLeaveEvent,
} from "./utils/types";

interface Constructor {
  pageName: string;
}

export class Page {
  _animatedParagraphs: Paragraph[] = [];
  _pageName = ""; //It has to be consistent data-transition-page-name="{{transitionPageName}}" for a given page

  constructor(props: Constructor) {
    this._pageName = props.pageName;
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

  onPageLeave = (e: PageTransitionLeaveEvent) => {
    const { fromPage, toPage, resolveFn, trigger } = e;

    const fromPageEl = getTransitionPage(fromPage.pageId);

    const toPageEl = getTransitionPage(toPage.pageId);

    if (fromPage.pageName === this._pageName) {
      this.animateLeave({
        fromPage,
        toPage,
        fromPageEl,
        toPageEl,
        trigger,
        resolveFn,
      });
    }
  };

  onPageEnter = (e: PageTransitionEnterEvent) => {
    const { fromPage, toPage } = e;

    const toPageEl = getTransitionPage(toPage.pageId);

    if (toPage.pageName === this._pageName) {
      this.animateEnter({
        fromPage,
        toPage,
        toPageEl,
      });
    }
  };

  animateLeave(props: AnimateLeave) {}

  animateEnter(props: AnimateEnter) {}

  onResize() {
    this._animatedParagraphs.forEach((p) => p.onResize());
  }
}
