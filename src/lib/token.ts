import { useEffect, useState } from "react";

let globalToken: string | null = null;

chrome.runtime.sendMessage({ type: "GET_COOKIE" }, (response) => {
  globalToken = response.token;
  console.log("send message", globalToken);
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
    setToken(message.token);
    globalToken = message.token;
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
