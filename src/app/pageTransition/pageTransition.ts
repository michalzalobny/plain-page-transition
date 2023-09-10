import { processUrl } from "./utils/processUrl";
import { myFetch } from "./utils/myFetch";
import {
  createCacheEntry,
  isPageCached,
  getPageFromCache,
} from "./utils/createCacheEntry";
import { parseDom } from "./utils/parseDom";
import { findCurrentTarget } from "./utils/findCurrentTarget";
import { globalState } from "../globalState";
import { generateHTMLContent } from "./utils/generateHTMLContent";

export const pageTransition = () => {
  const activePromises = new Map();

  let isTransitioning = false;
  let isPopping = false;
  let popTargetHref = "";
  let currentUrl = processUrl(window.location.href);
  let targetUrl = processUrl(window.location.href);
  const wrapper = document.querySelector("[data-transition-wrapper]")!;
  const transitionIndicator = document.querySelector(
    "[data-transition-indicator]"
  )!;

  let currentContentId = "";
  let targetContentId = "";

  const initCache = () => {
    createCacheEntry({
      page: parseDom(document.documentElement.outerHTML),
      url: currentUrl.href,
    });
  };

  initCache();

  const currentPage = getPageFromCache(currentUrl.href)!;
  currentContentId = `[data-transition-page-id="${currentPage.title}"]`;

  globalState.eventDispatcher.dispatchEvent({
    type: "onPageEnter",
    pageId: currentContentId,
  });

  const onPrefetch = (e: Event) => {
    const currentTarget = findCurrentTarget(e);
    if (!currentTarget) return;
    preload(currentTarget.href);
  };

  const preload = (url: string) => {
    const processedUrl = processUrl(url);

    if (!isPageCached(processedUrl.href)) {
      myFetch({
        url: processedUrl.href,
        shouldRunFallback: false,
        activePromises,
      });
    }
  };

  const beforeFetch = (
    trigger: string | HTMLAnchorElement = ""
  ): Promise<void> => {
    const targetPage = getPageFromCache(targetUrl.href);
    const currentPage = getPageFromCache(currentUrl.href);

    if (!targetPage || !currentPage) {
      console.error("No target or current page found in cache");
      return Promise.resolve();
    }

    targetContentId = `[data-transition-page-id="${targetPage.title}"]`;
    currentContentId = `[data-transition-page-id="${currentPage.title}"]`;

    globalState.savedScrollPositions.set(currentContentId, window.scrollY);

    return new Promise((resolve) => {
      wrapper.appendChild(generateHTMLContent(targetPage.htmlContent));
      transitionIndicator.classList.add("transition-indicator-active");

      if (trigger !== "popstate") {
        window.history.pushState({}, "", targetPage.url);
      }

      const onFinish = () => {
        const elToRemove = document.body.querySelector(currentContentId);

        if (elToRemove) elToRemove.remove();
        transitionIndicator.classList.remove("transition-indicator-active");

        //scroll document to top
        window.scrollTo(0, 0);

        resolve();
      };

      globalState.eventDispatcher.dispatchEvent({
        type: "onPageLeave",
        from: currentContentId,
        to: targetContentId,
        trigger,
        resolveFn: onFinish,
      });
    });
  };

  const afterFetch = (): Promise<void> => {
    currentUrl = targetUrl;
    popTargetHref = currentUrl.href;

    const targetPage = getPageFromCache(targetUrl.href);
    if (!targetPage) {
      console.error("No target page found in cache");
      return Promise.resolve();
    }

    const targetContentId = `[data-transition-page-id="${targetPage.title}"]`;

    return new Promise((resolve) => {
      // entry.renderer.update();

      // E.emit("NAVIGATE_IN", {
      //   from: this.currentCacheEntry,
      //   to: entry,
      //   trigger,
      // });

      isTransitioning = false;
      isPopping = false;
      document.title = targetPage.title;

      document.body.classList.remove("disable-scrolling");
      window.scrollTo(
        0,
        globalState.savedScrollPositions.get(targetContentId) || 0
      );

      globalState.eventDispatcher.dispatchEvent({
        type: "onPageEnter",
        pageId: targetContentId,
        comingFrom: currentContentId,
      });

      resolve();
    });
  };

  const navigateTo = async (
    url: string,
    trigger: string | HTMLAnchorElement = ""
  ): Promise<void> => {
    if (isTransitioning) {
      throw new Error("Transition is in progress - no interruption allowed");
    }

    isTransitioning = true;
    isPopping = true;
    targetUrl = processUrl(url);
    popTargetHref = window.location.href;

    document.body.classList.add("disable-scrolling");

    if (!isPageCached(targetUrl.href)) {
      await myFetch({
        url: targetUrl.href,
        activePromises,
      });
    }

    await beforeFetch(trigger);
    await afterFetch();
  };

  const onPopstate = () => {
    // don't trigger for on-page anchors, for example href="#section1"
    if (window.location.pathname === currentUrl.pathname && !isPopping) {
      return false;
    }

    if (isTransitioning || isPopping) {
      // overwrite history state with current page if currently navigating
      window.history.pushState({}, "", popTargetHref);

      console.warn("transitioning is in progress");
      return false;
    }

    if (!isPopping) {
      popTargetHref = window.location.href;
    }

    isPopping = true;

    navigateTo(window.location.href, "popstate");
  };

  const onClick = (e: Event) => {
    const currentTarget = findCurrentTarget(e);
    if (!currentTarget) return;

    const clickedUrl = processUrl(currentTarget.href);

    currentUrl = processUrl(window.location.href);

    if (currentUrl.host !== clickedUrl.host) {
      return;
    }

    e.preventDefault();
    navigateTo(clickedUrl.raw, currentTarget);
  };

  wrapper.addEventListener("click", onClick);
  wrapper.addEventListener("mouseenter", onPrefetch, true);
  wrapper.addEventListener("focus", onPrefetch, true);

  window.addEventListener("popstate", onPopstate);

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const scrollBarWidth = window.innerWidth - document.body.offsetWidth;
  document.documentElement.style.setProperty(
    "--scroll-bar-width",
    `${scrollBarWidth}px`
  );
};
