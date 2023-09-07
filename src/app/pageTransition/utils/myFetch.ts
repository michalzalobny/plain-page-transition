import { parseDom } from "./parseDom";
import { createCacheEntry } from "./createCacheEntry";

interface MyFetch {
  url: string;
  shouldRunFallback?: boolean;
  activePromises: Map<any, any>;
}

export const myFetch = async (props: MyFetch) => {
  const { url, activePromises, shouldRunFallback = true } = props;
  // If currently performing a fetch for the given URL, return that instead of starting a new
  if (activePromises.has(url)) {
    return activePromises.get(url);
  }

  const performRequest = async () => {
    const response = await fetch(url, {
      mode: "same-origin",
      method: "GET",
      headers: { "X-Requested-With": "myFetch" },
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error("Encountered a non 2xx HTTP status code");
    }

    const htmlString = await response.text();
    // const resolvedUrl = response.url; // URL after any redirects

    createCacheEntry({ page: parseDom(htmlString), url });
  };

  const request = performRequest()
    .catch((err) => {
      if (shouldRunFallback) {
        window.location.href = url;
      }
      throw err;
    })
    .finally(() => {
      activePromises.delete(url);
    });

  activePromises.set(url, request);
  return request;
};
