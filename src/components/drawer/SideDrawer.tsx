import { Add } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Drawer,
  DrawerProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import MarkurzIcon from "src/components/icons/MarkurzIcon";

interface SideDrawerProps extends DrawerProps {
  highlightedText: string;
}

const SideDrawer = (props: SideDrawerProps) => {
  const { highlightedText, ...drawerProps } = props;

  return (
    <Drawer
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "90vw", md: "35vw" },
          maxWidth: 420,
        },
      }}
      {...drawerProps}
    >
      <Stack spacing={3} p={2}>
        <Typography
          variant="h4"
          component="p"
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {highlightedText}
        </Typography>
        <TextField select label="Select apps">
          <MenuItem>
            <ListItemIcon>
              <MarkurzIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Jira</ListItemText>
          </MenuItem>
        </TextField>
        <LoadingButton variant="contained">Send</LoadingButton>
        <Button
          startIcon={<Add />}
          href="https://launch.markurz.com/"
          rel="noopener"
          target="_blank"
        >
          Add Apps
        </Button>
      </Stack>
    </Drawer>
  );
};

export default SideDrawer;
