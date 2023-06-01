import { Fab } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import SideDrawer from "src/components/drawer/SideDrawer";
import MarkurzIcon from "src/components/icons/MarkurzIcon";

const MarkurzFab = () => {
  const [highlightedText, setHighlightedText] = useState("");
  const [showFab, setShowFab] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [divPosition, setDivPosition] = useState({ top: 0, left: 0 });

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
      setDivPosition({ top: positionTop, left: positionLeft + 20 });
      setShowFab(true);
    }
  }, [showDrawer]);

  const handleFabClick = () => {
    setShowDrawer(true);
    setShowFab(false);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

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
          ...divPosition,
          position: "absolute",
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
