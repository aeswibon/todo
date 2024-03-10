export const RESULTS_PER_PAGE_LIMIT = 10;
export const PAGINATION_LIMIT = 36;
export interface OptionsType {
  id: number;
  text: string;
  desc?: string;
  disabled?: boolean;
}

export const PREFERENCE_SIDEBAR_KEY = "preferenceSidebar";
export const SIDEBAR = {
  COLLAPSED: "collapsed",
  FULL: "full",
};

export const LocalStorageKeys = {
  accessToken: "kanbex_access_token",
  refreshToken: "kanbex_refresh_token",
};
