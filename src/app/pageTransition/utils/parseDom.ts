const parser = new DOMParser();

export const parseDom = (html: string | Document) => {
  return typeof html === "string"
    ? parser.parseFromString(html, "text/html")
    : html;
};
