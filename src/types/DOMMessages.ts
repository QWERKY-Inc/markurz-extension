export type DOMMessage = {
  type: "GET_DOM" | "GET_COOKIE";
};

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
};
