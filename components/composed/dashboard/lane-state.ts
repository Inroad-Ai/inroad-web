/** One stage's column on a paged board (Pipeline, People). */
export interface LaneState<T> {
  items: T[];
  total: number;
  pagesLoaded: number;
  status: "loading" | "error" | "ready";
  loadingMore: boolean;
  errorMessage: string;
}

export function emptyLane<T>(): LaneState<T> {
  return {
    items: [],
    total: 0,
    pagesLoaded: 0,
    status: "loading",
    loadingMore: false,
    errorMessage: "",
  };
}
