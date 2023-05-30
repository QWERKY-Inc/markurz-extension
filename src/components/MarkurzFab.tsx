import { Drawer, Fab } from "@mui/material";
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
    } else {
      setHighlightedText("");
      setShowDiv(false);
    }
  };

  const handleFabClick = () => {
    setShowDrawer(true);
  };

  const handleDrawerClose = () => {
    setShowDrawer(false);
  };

  useEffect(() => {
    window.addEventListener("mouseup", handleHighlight);

    return () => {
      window.removeEventListener("mouseup", handleHighlight);
    };
  }, []);

  return (
    <>
      <Drawer open={showDrawer} anchor="right" onClose={handleDrawerClose}>
        stuff
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
