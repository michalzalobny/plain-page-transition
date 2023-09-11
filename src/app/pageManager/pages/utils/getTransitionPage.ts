export const getTransitionPage = (pageId: string) => {
  let pageEl = document.body.querySelector(
    `[data-transition-page-id="${pageId}"]`
  ) as HTMLElement | null;

  if (!pageEl) {
    console.error(`No pageEl for ${pageId}`);
    pageEl = document.createElement("div");
  }

  let pageName = pageEl?.dataset.transitionPageName;

  if (!pageName) {
    pageName = "";
    console.error(`No pageName for ${pageId}`);
  }

  return { pageEl, pageName };
};
