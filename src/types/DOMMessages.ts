export type DOMMessage = {
  type: "GET_DOM" | "GET_COOKIE" | "OPEN_DRAWER";
};

export type DOMMessageResponse = {
  title: string;
  headlines: string[];
};
