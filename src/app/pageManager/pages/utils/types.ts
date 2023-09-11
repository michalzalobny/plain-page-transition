import { CacheEntry } from "../../../pageTransition/pageTransition.types";

export interface AnimateEnter {
  fromPage: CacheEntry;
  toPage: CacheEntry;
  toPageEl: HTMLElement;
  toPageName: string;
}

export interface AnimateLeave {
  fromPage: CacheEntry;
  toPage: CacheEntry;
  fromPageEl: HTMLElement;
  toPageEl: HTMLElement;
  fromPageName: string;
  toPageName: string;
  trigger: string | HTMLAnchorElement;
  resolveFn: () => void;
}

export interface PageTransitionEnterEvent {
  fromPage: CacheEntry;
  toPage: CacheEntry;
}

export interface PageTransitionLeaveEvent {
  fromPage: CacheEntry;
  toPage: CacheEntry;
  trigger: string | HTMLAnchorElement;
  resolveFn: () => void;
}
