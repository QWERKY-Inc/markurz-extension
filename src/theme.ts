import "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material";

const theme = createTheme({
  components: {
    MuiTabPanel: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
  },
});

export default theme;
