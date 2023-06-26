import { useEffect, useState } from "react";
import { apolloClient } from "src/apollo";
import { useBetween } from "use-between";

let globalToken: string | null = null;

let windowRef: Window | null = null;

/**
 * Get the current token
 */
export const getToken = () => globalToken;

export const openSignInWindow = () => {
  if (windowRef && !windowRef.closed) {
    windowRef.focus();
  } else {
    windowRef = window.open(
      `${process.env.REACT_APP_LOGIN_URL}/login`,
      "_blank",
      "toolbar=0,location=0,menubar=0,width=600,height=800"
    );
  }
};

/**
 * Hook retrieving the current token
 */
const useToken = () => {
  const [token, setToken] = useState<string | null>(globalToken);

  const handleMessage = (message: any) => {
    if ("token" in message) {
      setToken(message.token);
      globalToken = message.token;
      if (message.token) {
        apolloClient.refetchQueries({});
        windowRef?.close();
      }
    }
  };

  useEffect(() => {
    if (chrome.extension) {
      chrome.runtime.onMessage.addListener(handleMessage);
      chrome.runtime.sendMessage({ type: "GET_COOKIE" }, (response) => {
        globalToken = response.token;
        setToken(response.token);
      });
    }
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { token };
};

export const useTokenShared = () => useBetween(useToken);
