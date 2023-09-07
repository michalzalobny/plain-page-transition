import { processUrl } from "./processUrl";

interface CacheEntry {
  DOM: Element;
  title: string;
  url: string;
}

interface CreateCacheEntry {
  page: Document;
  url: string;
}

const cache: Map<string, CacheEntry> = new Map();

export const createCacheEntry = (props: CreateCacheEntry) => {
  const { page, url } = props;
  const content = page.querySelector("[data-transition-content-id]");

  if (!content) {
    console.error(
      "No content found in page while creating cache entry - add a [data-transition-content-id] element to your page"
    );
  }

  const processedUrl = processUrl(url);

  const div = document.createElement("div");
  div.innerHTML = content!.outerHTML;
  const DOM = div.firstElementChild!;

  const entry = {
    DOM,
    url: processedUrl.href,
    title: page.title,
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
