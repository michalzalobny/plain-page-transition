import { processUrl } from "./processUrl";

interface CacheEntry {
  contentString: string;
  title: string;
  url: string;
  rawUrl: string;
}

interface CreateCacheEntry {
  page: Document;
  url: string;
}

export const cache: Map<string, CacheEntry> = new Map();

export const createCacheEntry = (props: CreateCacheEntry) => {
  const { page, url } = props;
  const content = page.querySelector("[data-transition-content-id]");

  if (!content) {
    console.error(
      "No content found in page while creating cache entry - add a [data-transition-content-id] element to your page"
    );
  }

  const processedUrl = processUrl(url);

  const entry = {
    contentString: content!.outerHTML,
    url: processedUrl.href,
    rawUrl: processedUrl.raw,
    title: page.title,
  };

  cache.set(processedUrl.href, entry);
};
