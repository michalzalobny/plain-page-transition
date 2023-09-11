import { processUrl } from "./processUrl";
import { CacheEntry } from "../pageTransition.types";

interface CreateCacheEntry {
  page: Document;
  url: string;
}

const cache: Map<string, CacheEntry> = new Map();

export const createCacheEntry = (props: CreateCacheEntry) => {
  const { page, url } = props;
  let content = page.querySelector("[data-transition-page-id]") as HTMLElement;

  if (!content) {
    console.error("Content not found - add [data-transition-page-id] to page");
    content = document.createElement("div");
  }

  const processedUrl = processUrl(url);

  const entry = {
    htmlContent: content.outerHTML,
    url: processedUrl.href,
    title: page.title,
    pageId: content.dataset.transitionPageId || "",
  };

  cache.set(processedUrl.href, entry);
};

export const getPageFromCache = (url: string) => {
  const processedUrl = processUrl(url);
  const entry = cache.get(processedUrl.href);

  if (!entry) {
    console.error(`No entry found in cache: ${processedUrl.href}`);
    return null;
  }
  return entry;
};

export const isPageCached = (url: string) => {
  const processedUrl = processUrl(url);
  return cache.has(processedUrl.href);
};
