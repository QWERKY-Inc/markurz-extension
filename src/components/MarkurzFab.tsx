import { Fab, Fade } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SideDrawer from "src/components/drawer/SideDrawer";
import MarkurzIcon from "src/components/icons/MarkurzIcon";
import IFrame from "src/components/iframe/IFrame";
import { MARKURZ_DIV_NAME } from "src/lib/dom";
import { useTokenShared } from "src/lib/token";

const MarkurzFab = () => {
  const [highlightedText, setHighlightedText] = useState("");
  const [showFab, setShowFab] = useState(
    !!process.env.REACT_APP_SIMULATE_LOCALLY,
  );
  const [showDrawer, setShowDrawer] = useState(false);
  const { token } = useTokenShared();
  const winRef = useRef<Window | null>(null);
  const [enabled, setEnabled] = useState(
    !!process.env.REACT_APP_SIMULATE_LOCALLY,
  );

  const handleHighlight = useCallback(() => {
    if (showDrawer) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText && selection && /\S/.test(selectedText)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      const positionTop = rect.top + scrollTop - rect.height / 2;
      const positionLeft = rect.left + scrollLeft + rect.width;

      setHighlightedText(selectedText);
      const rootElement = document.getElementById(MARKURZ_DIV_NAME);
      if (rootElement) {
        rootElement.style.top = `${positionTop}px`;
        rootElement.style.left = `${positionLeft + 20}px`;
      }
      setShowFab(true);
    }
  }, [showDrawer]);

  const handleFabClick = useCallback(() => {
    setShowDrawer(true);
    setShowFab(false);
  }, []);

  const handleDrawerClose = (
    event: React.KeyboardEvent | React.MouseEvent,
    reason: "backdropClick" | "escapeKeyDown",
  ) => {
    if (reason !== "backdropClick") {
      setShowDrawer(false);
    }
  };

  useEffect(() => {
    if (token) {
      if (winRef.current) {
        winRef.current?.close();
        setShowDrawer(true);
      }
    }
  }, [token]);

  const handleSelectionChange = useCallback(() => {
    if (showDrawer) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (!selectedText) {
      setHighlightedText("");
      setShowFab(false);
    }
  }, [showDrawer]);

  useEffect(() => {
    window.addEventListener("mouseup", handleHighlight);
    window.addEventListener("click", handleHighlight);
    window.addEventListener("pointerup", handleHighlight);
    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      window.removeEventListener("mouseup", handleHighlight);
      window.removeEventListener("click", handleHighlight);
      window.removeEventListener("pointerup", handleHighlight);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [handleHighlight, handleSelectionChange]);

  const handleMessage = useCallback(
    (message: any) => {
      if (message.type === "OPEN_DRAWER") {
        setHighlightedText(
          (prevState) => prevState || message.selectionText || document.title,
        );
        handleFabClick();
      }
    },
    [handleFabClick],
  );

  useEffect(() => {
    chrome.storage?.local.get(["showFab"], (v) => {
      const shouldShow = "showFab" in v ? v.showFab : true;
      setEnabled(shouldShow);
    });
  }, []);

  const handleStorageChange = (changes: {
    [p: string]: chrome.storage.StorageChange;
  }) => {
    if ("showFab" in changes) {
      setEnabled(changes.showFab.newValue);
    }
  };

  useEffect(() => {
    if (chrome.extension) {
      chrome.runtime?.onMessage.addListener(handleMessage);
      chrome.storage?.onChanged.addListener(handleStorageChange);
    }
    return () => {
      chrome.runtime?.onMessage.removeListener(handleMessage);
      chrome.storage?.onChanged.removeListener(handleStorageChange);
    };
  }, [handleMessage]);

  return (
    <>
      <IFrame
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 425,
          height: "100vh",
          border: "none",
          background: "transparent",
        }}
      >
        <Fade in={showDrawer}>
          <div>
            <SideDrawer
              highlightedText={highlightedText}
              open={showDrawer}
              onClose={handleDrawerClose}
            />
          </div>
        </Fade>
      </IFrame>
      <Fab
        aria-label="create-task"
        size="small"
        sx={{
          display: showFab && enabled ? "" : "none",
        }}
        color="primary"
        onClick={handleFabClick}
      >
        <MarkurzIcon />
      </Fab>
    </>
  );
};

export default MarkurzFab;
