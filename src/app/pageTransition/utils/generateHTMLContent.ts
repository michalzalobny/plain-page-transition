export const generateHTMLContent = (htmlContent: string) => {
  const div = document.createElement("div");
  div.innerHTML = htmlContent;
  const DOM = div.firstElementChild;

  if (!DOM) {
    console.error("No first element found while generating HTML content");
  }

  return DOM!;
};
