import TWEEN from "@tweenjs/tween.js";

import { pageTransition } from "./pageTransition/pageTransition";
import { pageManager } from "./pageManager/pageManager";

pageTransition();
pageManager();

// Setup the animation loop for TWEEN.
function animate(time: number) {
  TWEEN.update(time);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
