import { useEffect, useState } from "react";
import { useBetween } from "use-between";

let globalToken: string | null = null;

chrome.runtime.sendMessage({ type: "GET_COOKIE" }, (response) => {
  globalToken = response.token;
});

/**
 * Get the current token
 */
export const getToken = () => globalToken;

/**
 * Hook retrieving the current token
 */
export const useToken = () => {
  const [token, setToken] = useState<string | null>(globalToken);

  const handleMessage = (message: any) => {
    if ("token" in message) {
      setToken(message.token);
      globalToken = message.token;
    }
  };

  useEffect(() => {
    if (chrome.extension) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { token };
};

export const useTokenShared = () => useBetween(useToken);
