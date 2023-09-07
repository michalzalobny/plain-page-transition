import TWEEN from "@tweenjs/tween.js";

import { pageTransition } from "./pageTransition/pageTransition";
import { pageManager, resizePages } from "./pageManager/pageManager";

pageManager();
pageTransition();

window.addEventListener("resize", resizePages);

// Setup the animation loop for TWEEN.
function animate(time: number) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
