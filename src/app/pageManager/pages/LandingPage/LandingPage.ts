import TWEEN, { Tween } from "@tweenjs/tween.js";

import { Page } from "../Page";
import { getBoundingRectCustom } from "../../../utils/getBoundingRectCustom";
import { Paragraph } from "../../../utils/Paragraph";
import { globalState } from "../../../globalState";
import { AnimateEnter, AnimateLeave } from "../utils/types";

interface Constructor {
  pageName: string;
}

export class LandingPage extends Page {
  _exitPageTween: Tween<{}> | null = null;
  _testFig: HTMLElement | null = null;

  constructor(props: Constructor) {
    super(props);
  }

  animateLeave(props: AnimateLeave) {
    super.animateLeave(props);

    const {
      fromPageEl,
      fromPage,
      fromPageName,
      toPage,
      toPageEl,
      toPageName,
      trigger,
      resolveFn,
    } = props;

    this._animatedParagraphs.forEach((p) => p.animateOut());

    let fig: HTMLElement;

    if (!(trigger instanceof HTMLAnchorElement)) {
      fig = fromPageEl.querySelector(
        `[data-figure-id="${toPage.pageId}"]`
      ) as HTMLElement;
    } else {
      fig = trigger.querySelector("figure")!;
    }

    const figRect = getBoundingRectCustom(fig);

    const destFig = toPageEl.querySelector("figure")!;
    const destFigRect = getBoundingRectCustom(destFig);

    const toScrollPos =
      globalState.savedScrollPositions.get(toPage.pageId) || 0;
    const fromScrollPos =
      globalState.savedScrollPositions.get(fromPage.pageId) || 0;

    const destTop = destFigRect.top + fromScrollPos - toScrollPos;
    const currentTop = figRect.top;

    const transX =
      destFigRect.left - figRect.left + (destFigRect.width - figRect.width) / 2;
    const transY =
      destTop - currentTop + (destFigRect.height - figRect.height) / 2;

    const scale = destFigRect.width / figRect.width;

    // console.log("transY", transY);

    // console.log(
    //   "destFigRect top",
    //   destFigRect.top + fromScrollPos - toScrollPos
    // );

    //select all figs on the fromEl
    const figs = fromPageEl.querySelectorAll("figure");
    //remove the fig that is being animated
    const figsArr = Array.from(figs).filter((f) => f !== fig);

    figsArr.forEach((f) => {
      const child = f.children[0] as HTMLElement;
      if (!child) return;

      child.style.opacity = "0";
      child.style.transition =
        "transform 0.8s var(--easing-1), opacity 0.8s ease-in-out";

      child.style.transform = "translateX(-100%)";
    });

    if (this._exitPageTween) this._exitPageTween.stop();

    this._exitPageTween = new TWEEN.Tween({
      scale: 1,
      transX: 0,
      transY: 0,
    })
      .to(
        {
          scale,
          transX: transX,
          transY: transY,
        },
        1200
      )
      .delay(400)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate((obj) => {
        fig.style.transform = `translate3d(${obj.transX}px, ${obj.transY}px, 0px) scale(${obj.scale})`;
      })
      .start()
      .onComplete(() => {
        this._animatedParagraphs.forEach((p) => p.destroy());
        this._animatedParagraphs = [];

        // figsArr.forEach((f) => {
        //   const child = f.children[0] as HTMLElement;
        //   if (!child) return console.log("no child");
        //   child.classList.remove("figure-img-case-study--out");
        // });

        // fig.style.width = figRect.width + "px";
        // fig.style.height = figRect.height + "px";
        // fig.style.transform = `translate(0px, 0px)`;

        resolveFn();
      });
    // }
  }

  animateEnter(props: AnimateEnter) {
    super.animateEnter(props);
    const { fromPage, toPage, toPageEl, toPageName } = props;

    const paragraphs = toPageEl.querySelectorAll(
      '[data-animation="paragraph"]'
    );

    Array.from(paragraphs).forEach((p) => {
      this._animatedParagraphs.push(
        new Paragraph({ element: p as HTMLElement })
      );
    });

    window.requestAnimationFrame(() => {
      this._animatedParagraphs.forEach((p) => p.animateIn());
    });

    //find element that has comingFromId as data-transition-page-id
    const fig = toPageEl.querySelector(
      `[data-figure-id="${fromPage.pageId}"]`
    ) as HTMLElement;

    //get all the figures
    const figs = toPageEl.querySelectorAll("figure");
    Array.from(figs).forEach((f, key) => {
      if (key === 4) this._testFig = f as HTMLElement;
      const child = f.children[0] as HTMLElement;
      if (!child) return;

      if (f === fig) {
        child.style.opacity = "1";
      } else {
        child.style.opacity = "1";
        child.style.transition =
          "transform 0.8s var(--easing-1), opacity 0.8s ease-in-out";
      }
    });
  }
}
