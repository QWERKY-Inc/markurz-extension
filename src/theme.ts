import "@fontsource/inter";
import "@mui/lab/themeAugmentation";
import { createTheme } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
  },
});

theme.components = {
  MuiTabPanel: {
    styleOverrides: {
      root: {
        padding: 0,
      },
    },
  },
  MuiInputLabel: {
    styleOverrides: {
      asterisk: {
        color: theme.palette.error.main,
      },
    },
  },
};

export default theme;
