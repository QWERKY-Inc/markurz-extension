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
      `${process.env.REACT_APP_LOGIN_URL}/login?referrer=${document.documentURI}`,
      "_blank",
      // Make it a popup rather than a tab
      "toolbar=0,location=0,menubar=0,width=600,height=800"
    );
  }
};

/**
 * Hook retrieving the current token
 */
const useToken = () => {
  const [token, setToken] = useState<string | null>(globalToken);
  const [loading, setLoading] = useState(true);

  const handleMessage = (message: any) => {
    if ("token" in message) {
      setToken(message.token);
      globalToken = message.token;
      if (message.token) {
        apolloClient.refetchQueries({ include: "active" });
        windowRef?.close();
        windowRef = null;
      }
    }
  };

  useEffect(() => {
    if (!process.env.REACT_APP_SIMULATE_LOCALLY) {
      if (chrome.extension) {
        chrome.runtime.onMessage.addListener(handleMessage);
        chrome.runtime.sendMessage({ type: "GET_COOKIE" }, (response) => {
          globalToken = response.token;
          setToken(response.token);
          setLoading(false);
        });
      }
    } else {
      const token = window.localStorage.getItem("token");
      globalToken = token;
      setToken(token);
      setLoading(false);
    }
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  return { token, loading };
};

export const useTokenShared = () => useBetween(useToken);
