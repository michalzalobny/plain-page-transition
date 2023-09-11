import { CacheEntry } from "../../../pageTransition/pageTransition.types";

export interface AnimateEnter {
  fromPage: CacheEntry;
  toPage: CacheEntry;
  toPageEl: HTMLElement;
}

export interface AnimateLeave {
  fromPage: CacheEntry;
  toPage: CacheEntry;
  fromPageEl: HTMLElement;
  toPageEl: HTMLElement;
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
