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

    const { pageEl: fromPageEl, pageName: fromPageName } = getTransitionPage(
      fromPage.pageId
    );

    const { pageEl: toPageEl, pageName: toPageName } = getTransitionPage(
      toPage.pageId
    );

    if (fromPageName === this._pageName) {
      this.animateLeave({
        fromPage,
        toPage,
        fromPageEl,
        toPageEl,
        fromPageName,
        toPageName,
        trigger,
        resolveFn,
      });
    }
  };

  onPageEnter = (e: PageTransitionEnterEvent) => {
    const { fromPage, toPage } = e;

    const { pageEl: toPageEl, pageName: toPageName } = getTransitionPage(
      toPage.pageId
    );

    if (toPageName === this._pageName) {
      this.animateEnter({
        fromPage,
        toPage,
        toPageEl,
        toPageName,
      });
    }
  };

  animateLeave(props: AnimateLeave) {}

  animateEnter(props: AnimateEnter) {}

  onResize() {
    this._animatedParagraphs.forEach((p) => p.onResize());
  }
}
