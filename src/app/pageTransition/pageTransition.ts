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
import { Trigger, NavigateTo, CacheEntry } from "./pageTransition.types";

export const pageTransition = () => {
  const activePromises = new Map();

  const wrapper = document.querySelector("[data-transition-wrapper]")!;

  let isTransitioning = false;
  let isPopping = false;
  let popTargetHref = "";

  let currentUrl = processUrl(window.location.href);
  let targetUrl = processUrl(window.location.href);

  let currentPage: CacheEntry | null = null;
  let targetPage: CacheEntry | null = null;

  const init = () => {
    createCacheEntry({
      page: parseDom(document.documentElement.outerHTML),
      url: currentUrl.href,
    });

    currentPage = getPageFromCache(currentUrl.href);
    targetPage = getPageFromCache(currentUrl.href);

    globalState.eventDispatcher.dispatchEvent({
      type: "onPageEnter",
      fromPage: currentPage,
      toPage: targetPage,
    });
  };

  init();

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

  const beforeFetch = (trigger: Trigger): Promise<void> => {
    return new Promise((resolve) => {
      targetPage = getPageFromCache(targetUrl.href);
      currentPage = getPageFromCache(currentUrl.href);

      if (!targetPage || !currentPage) {
        console.error("No target or current page found in cache");
        return Promise.resolve();
      }
      globalState.savedScrollPositions.set(currentPage.pageId, window.scrollY);
      wrapper.appendChild(generateHTMLContent(targetPage.htmlContent));
      const targetPageUrl = targetPage.url;

      const onFinish = () => {
        if (trigger !== "popstate") {
          window.history.pushState({}, "", targetPageUrl);
        }

        const elToRemove = document.body.querySelector(
          `[data-transition-page-id="${currentPage?.pageId}"]`
        );
        if (elToRemove) elToRemove.remove();

        //scroll document to top
        window.scrollTo(0, 0);

        resolve();
      };

      globalState.eventDispatcher.dispatchEvent({
        type: "onPageLeave",
        fromPage: currentPage,
        toPage: targetPage,
        trigger,
        resolveFn: onFinish,
      });
    });
  };

  const afterFetch = (): Promise<void> => {
    currentUrl = targetUrl;
    popTargetHref = currentUrl.href;

    return new Promise((resolve) => {
      targetPage = getPageFromCache(targetUrl.href);

      if (!targetPage || !currentPage) {
        console.error("No target page found in cache");
        return Promise.resolve();
      }

      isTransitioning = false;
      isPopping = false;
      document.title = targetPage.title;

      document.body.classList.remove("disable-scrolling");

      window.scrollTo(
        0,
        globalState.savedScrollPositions.get(targetPage.pageId) || 0
      );

      globalState.eventDispatcher.dispatchEvent({
        type: "onPageEnter",
        fromPage: currentPage,
        toPage: targetPage,
      });

      resolve();
    });
  };

  const navigateTo = async ({ trigger, url }: NavigateTo): Promise<void> => {
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

    navigateTo({ url: window.location.href, trigger: "popstate" });
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
    navigateTo({ url: clickedUrl.raw, trigger: currentTarget });
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
