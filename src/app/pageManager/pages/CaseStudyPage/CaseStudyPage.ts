import TWEEN, { Tween } from "@tweenjs/tween.js";

import { Page } from "../Page";
import { getBoundingRectCustom } from "../../../utils/getBoundingRectCustom";
import { Paragraph } from "../../../utils/Paragraph";
import { globalState } from "../../../globalState";
import { AnimateEnter, AnimateLeave } from "../utils/types";

interface Constructor {
  pageName: string;
}

export class CaseStudyPage extends Page {
  _exitPageTween: Tween<{}> | null = null;

  constructor(props: Constructor) {
    super(props);
  }

  animateLeave(props: AnimateLeave) {
    super.animateLeave(props);

    const { fromPage, fromPageEl, resolveFn, toPage, toPageEl, trigger } =
      props;

    this._animatedParagraphs.forEach((p) => p.animateOut());

    const fig = fromPageEl.querySelector("figure")!;
    const figRect = getBoundingRectCustom(fig);

    //Find element inside toEl with data-figure-id=elId
    const destFig = toPageEl.querySelector(
      `[data-figure-id="${fromPage.pageId}"]`
    ) as HTMLElement;
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

    //select all figs on the fromEl
    const figs = fromPageEl.querySelectorAll("figure");
    //remove the fig that is being animated
    const figsArr = Array.from(figs).filter((f) => f !== fig);

    figsArr.forEach((f) => {
      const child = f.children[0] as HTMLElement;
      if (!child) return;
      child.style.transform = `translateX(${-100}%`;
      child.style.opacity = "0";
    });

    if (this._exitPageTween) this._exitPageTween.stop();

    this._exitPageTween = new TWEEN.Tween({
      scale: 1,
      transX: 0,
      transY: 0,
    })
      .to(
        {
          scale: scale,
          transX: transX,
          transY: transY,
        },
        1200
      )
      .delay(400)
      .easing(TWEEN.Easing.Exponential.InOut)
      .onUpdate((obj) => {
        // fig.style.width = `${obj.width}px`;
        // fig.style.height = `${obj.height}px`;

        fig.style.transform = `translate3d(${obj.transX}px, ${obj.transY}px, 0px) scale(${obj.scale})`;
      })
      .start()
      .onComplete(() => {
        this._animatedParagraphs.forEach((p) => p.destroy());
        this._animatedParagraphs = [];

        // fig.style.width = figRect.width + "px";
        // fig.style.height = figRect.height + "px";
        // fig.style.transform = `translate(0px, 0px)`;

        resolveFn();
      });
  }

  animateEnter(props: AnimateEnter) {
    super.animateEnter(props);
    const { fromPage, toPage, toPageEl } = props;

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
  }
}
