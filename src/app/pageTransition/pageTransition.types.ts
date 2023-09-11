export type Trigger = string | HTMLAnchorElement;

export interface NavigateTo {
  url: string;
  trigger: Trigger;
}

export interface CacheEntry {
  htmlContent: string;
  title: string;
  url: string;
  pageId: string;
}
