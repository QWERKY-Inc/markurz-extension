import "@fontsource/inter";
import "@mui/lab/themeAugmentation";
import { createTheme, responsiveFontSizes } from "@mui/material";

const theme = createTheme({
  typography: {
    fontFamily: ["Inter", "Roboto", "Helvetica", "Arial", "sans-serif"].join(
      ",",
    ),
    // We ignore because for some reason this didn't get exposed in TS
    // @ts-ignore
    pxToRem: (size) => `${size}px`,
  },
});

theme.components = {
  MuiTypography: {
    styleOverrides: {
      h5: {
        fontWeight: 600,
      },
    },
  },
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
  MuiPopper: {
    defaultProps: {
      style: {
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
  MuiInputBase: {
    styleOverrides: {
      inputMultiline: {
        border: "none !important",
        boxShadow: "none !important",
        padding: "unset !important",
      },
      input: {
        border: "none !important",
        boxShadow: "none !important",
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        background: "none",
      },
    },
  },
};

export default responsiveFontSizes(theme);
