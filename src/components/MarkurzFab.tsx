import { Fab } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SideDrawer from "src/components/drawer/SideDrawer";
import MarkurzIcon from "src/components/icons/MarkurzIcon";
import { useTokenShared } from "src/lib/token";

const MarkurzFab = () => {
  const [highlightedText, setHighlightedText] = useState("");
  const [showFab, setShowFab] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { token } = useTokenShared();
  const winRef = useRef<Window | null>(null);

  const handleHighlight = useCallback(() => {
    if (showDrawer) return;

    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (selectedText && selection) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

      const positionTop = rect.top + scrollTop - rect.height / 2;
      const positionLeft = rect.left + scrollLeft + rect.width;

      setHighlightedText(selectedText);
      const rootElement = document.getElementById("markurz-root");
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

  const handleDrawerClose = () => {
    setShowDrawer(false);
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
        setHighlightedText((prevState) => prevState || message.selectionText);
        handleFabClick();
      }
    },
    [handleFabClick]
  );

  useEffect(() => {
    if (chrome.extension) {
      chrome.runtime.onMessage.addListener(handleMessage);
    }
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, [handleMessage]);

  return (
    <>
      <SideDrawer
        highlightedText={highlightedText}
        open={showDrawer}
        onClose={handleDrawerClose}
      />
      <Fab
        aria-label="create-task"
        size="small"
        sx={{
          display: showFab ? "" : "none",
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
