import "@fontsource/inter";
import "@mui/lab/themeAugmentation";
import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ","
    ),
    // We ignore because for some reason this didn't get exposed in TS
    // @ts-ignore
    pxToRem: (size) => `${size}px`,
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
  MuiTextField: {
    defaultProps: {
      size: "small",
    },
  },
  MuiPopover: {
    styleOverrides: {
      root: {
        zIndex: 100000,
      },
    },
  },
  MuiAutocomplete: {
    styleOverrides: {
      popper: {
        zIndex: 100000,
      },
    },
  },
};

export default responsiveFontSizes(theme);
