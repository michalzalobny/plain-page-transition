export type Trigger = string | HTMLAnchorElement;

export interface NavigateTo {
  url: string;
  trigger: Trigger;
}
