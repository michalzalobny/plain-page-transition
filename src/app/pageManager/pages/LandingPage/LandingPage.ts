import TWEEN, { Tween } from "@tweenjs/tween.js";

import { Page, AnimateExit, AnimateEnter } from "../Page";
import { getBoundingRectCustom } from "../../../utils/getBoundingRectCustom";
import { Paragraph } from "../../../utils/Paragraph";
import { globalState } from "../../../globalState";

export class LandingPage extends Page {
  _exitPageTween: Tween<{}> | null = null;
  _testFig: HTMLElement | null = null;

  constructor() {
    super();
  }

  animateExit(props: AnimateExit) {
    super.animateExit(props);

    const { fromEl, fromId, toEl, toId, trigger, resolveFn } = props;

    this._animatedParagraphs.forEach((p) => p.animateOut());

    if (toId === "case-study") {
      let fig: HTMLElement;

      if (!(trigger instanceof HTMLAnchorElement)) {
        const elId = toEl.dataset.transitionContentId!.slice(0, -7);

        fig = fromEl.querySelector(`[data-figure-id="${elId}"]`) as HTMLElement;
      } else {
        fig = trigger.querySelector("figure")!;
      }

      const figRect = getBoundingRectCustom(fig);

      const destFig = toEl.querySelector("figure")!;
      const destFigRect = getBoundingRectCustom(destFig);

      const toScrollId = `[data-transition-content-id="${toEl.dataset.transitionContentId}"]`;
      const fromScrollId = `[data-transition-content-id="${fromEl.dataset.transitionContentId}"]`;

      const toScrollPos = globalState.savedScrollPositions.get(toScrollId) || 0;
      const fromScrollPos =
        globalState.savedScrollPositions.get(fromScrollId) || 0;

      const destTop = destFigRect.top + fromScrollPos - toScrollPos;
      const currentTop = figRect.top;

      const transX =
        destFigRect.left -
        figRect.left +
        (destFigRect.width - figRect.width) / 2;
      const transY =
        destTop - currentTop + (destFigRect.height - figRect.height) / 2;

      const scale = destFigRect.width / figRect.width;

      // console.log("transY", transY);

      // console.log(
      //   "destFigRect top",
      //   destFigRect.top + fromScrollPos - toScrollPos
      // );

      //select all figs on the fromEl
      const figs = fromEl.querySelectorAll("figure");
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
  }

  animateEnter(props: AnimateEnter) {
    super.animateEnter(props);
    const { el, pageId, comingFromId } = props;

    const paragraphs = el.querySelectorAll('[data-animation="paragraph"]');

    if (pageId === "landing") {
      Array.from(paragraphs).forEach((p) => {
        this._animatedParagraphs.push(
          new Paragraph({ element: p as HTMLElement })
        );
      });

      window.requestAnimationFrame(() => {
        this._animatedParagraphs.forEach((p) => p.animateIn());
      });

      // Extract the content within double quotes using a regex match
      let match = comingFromId?.match(/"([^"]+)"/);
      let result = "";
      if (match) {
        result = match[1]; // The content inside the quotes
        result = result.substring(0, result.length - 7); // Remove the last 9 characters
      }

      //find element that has comingFromId as data-transition-content-id
      const fig = el.querySelector(
        `[data-figure-id="${result}"]`
      ) as HTMLElement;

      //get all the figures
      const figs = el.querySelectorAll("figure");
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
}
