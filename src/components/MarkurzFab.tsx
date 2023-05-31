import { Drawer, Fab, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MarkurzIcon from "src/components/icons/MarkurzIcon";

const MarkurzFab = () => {
  const [highlightedText, setHighlightedText] = useState("");
  const [showDiv, setShowDiv] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [divPosition, setDivPosition] = useState({ top: 0, left: 0 });

  const handleHighlight = () => {
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
      setShowDiv(true);
    }
  };

  const handleFabClick = () => {
    setShowDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  const handleSelectionChange = () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString();

    if (!selectedText) {
      setHighlightedText("");
      setShowDiv(false);
    }
  };

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
  }, []);

  return (
    <>
      <Drawer open={showDrawer} anchor="right" onClose={handleDrawerClose}>
        <Stack spacing={2} p={2}>
          <Typography variant="h2" component="p">
            {highlightedText}
          </Typography>
        </Stack>
      </Drawer>
      <Fab
        aria-label="create-task"
        size="small"
        sx={{
          ...divPosition,
          position: "absolute",
          display: showDiv ? "" : "none",
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
