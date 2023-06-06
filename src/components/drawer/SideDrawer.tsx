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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import MarkurzIcon from "src/components/icons/MarkurzIcon";

interface SideDrawerProps extends DrawerProps {
  highlightedText: string;
}

const SideDrawer = (props: SideDrawerProps) => {
  const { highlightedText, ...drawerProps } = props;
  const [selectedApp, setSelectedApp] = useState("");
  const { handleSubmit } = useForm();

  const submit = () => {
    console.log("submit");
  };

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
      <form onSubmit={handleSubmit(submit)}>
        <Stack spacing={3} p={2}>
          <Typography
            variant="h4"
            component="p"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {highlightedText}
          </Typography>
          <TextField
            select
            label="Select apps"
            value={selectedApp}
            onChange={(e) => setSelectedApp(e.target.value)}
            sx={{
              "& .MuiSelect-select": {
                display: "flex",
                alignItems: "center",
                gap: 2,
              },
              "& .MuiListItemText-root": {
                margin: 0,
              },
              "& .MuiListItemIcon-root": {
                minWidth: "unset",
              },
            }}
          >
            <MenuItem value="jira">
              <ListItemIcon>
                <MarkurzIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Jira</ListItemText>
            </MenuItem>
          </TextField>
          <LoadingButton variant="contained" type="submit">
            Send
          </LoadingButton>
          <Button
            type="button"
            startIcon={<Add />}
            href="https://launch.markurz.com/"
            rel="noopener"
            target="_blank"
          >
            Add Apps
          </Button>
        </Stack>
      </form>
    </Drawer>
  );
};

export default SideDrawer;
