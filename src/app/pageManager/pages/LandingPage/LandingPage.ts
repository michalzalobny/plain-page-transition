import TWEEN, { Tween } from "@tweenjs/tween.js";

import { Page, AnimateExit, AnimateEnter } from "../Page";
import { getBoundingRectCustom } from "../../../utils/getBoundingRectCustom";
import { Paragraph } from "../../../utils/Paragraph";

export class LandingPage extends Page {
  _exitPageTween: Tween<{}> | null = null;

  constructor() {
    super();
  }

  animateExit(props: AnimateExit) {
    super.animateExit(props);

    const { fromEl, fromId, toEl, toId, trigger } = props;

    this._animatedParagraphs.forEach((p) => p.animateOut());

    if (toId === "case-study") {
      if (trigger instanceof HTMLAnchorElement) {
        const fig = trigger.querySelector("figure")!;
        const figRect = getBoundingRectCustom(fig);

        const destFig = toEl.querySelector("figure")!;
        const destFigRect = getBoundingRectCustom(destFig);

        const transX = destFigRect.left - figRect.left;
        const transY = destFigRect.top - figRect.top + window.scrollY;

        const scaleFactor = destFigRect.width / figRect.width;

        if (this._exitPageTween) this._exitPageTween.stop();

        this._exitPageTween = new TWEEN.Tween({
          scaleFactor: 1,
          height: figRect.height,
          transX: 0,
          transY: 0,
        })
          .to(
            {
              scaleFactor,
              height: figRect.height * 2,
              transX:
                transX + (figRect.width * scaleFactor - figRect.width) / 2,
              transY: transY + (figRect.height * scaleFactor - figRect.height),
            },
            1200
          )
          .easing(TWEEN.Easing.Exponential.InOut)
          .onUpdate((obj) => {
            // fig.style.width = `${obj.width}px`;
            fig.style.height = `${obj.height}px`;
            fig.style.transform = `translate(${obj.transX}px, ${obj.transY}px) scale(${obj.scaleFactor})`;
          })
          .start()
          .onComplete(() => {
            this._animatedParagraphs.forEach((p) => p.destroy());
            this._animatedParagraphs = [];
          });
      }
    }
  }

  animateEnter(props: AnimateEnter) {
    super.animateEnter(props);
    const { el, pageId } = props;

    const paragraphs = el.querySelectorAll('[data-animation="paragraph"]');

    if (pageId === "landing") {
      Array.from(paragraphs).forEach((p) => {
        this._animatedParagraphs.push(
          new Paragraph({ element: p as HTMLElement })
        );
      });

      this._animatedParagraphs.forEach((p) => p.animateIn());
    }
  }
}
