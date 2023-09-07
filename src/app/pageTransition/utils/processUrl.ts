export const processUrl = (url: string) => {
  const details = new URL(url, window.location.origin);
  const href = details.href;
  let normalized = null;

  if (details.hash.length) {
    normalized = url.replace(details.hash, "");
  }

  if (href.endsWith("/")) {
    normalized = href.slice(0, -1);
  }

  return {
    hasHash: details.hash.length > 0,
    pathname: details.pathname,
    host: details.host,
    raw: url,
    href: normalized || href,
  };
};
