import { useQuery } from '@apollo/client';
import { CableRounded, InfoOutlined, SpeedRounded } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
  Switch,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { genericOnClick } from 'src/chromeServices/contextMenu';
import MarkurzIcon from 'src/components/icons/MarkurzIcon';
import { graphql } from 'src/generated';
import { useTokenShared } from 'src/lib/token';

const QUERY_ME = graphql(/* GraphQL */ `
  query Me {
    user {
      id
      email
      name
    }
  }
`);

const ExtensionApp = () => {
  const { token } = useTokenShared();
  const { data, loading, error } = useQuery(QUERY_ME, {
    skip: !token,
  });
  const [fabEnabled, setFabEnabled] = useState<boolean | undefined>(true);

  useEffect(() => {
    chrome.storage?.local.get(["showFab"], (v) => {
      const shouldShow = "showFab" in v ? v.showFab : true;
      setFabEnabled(shouldShow);
    });
  }, []);

  const handleOpenDrawerButtonClick = () => {
    genericOnClick({ menuItemId: 0, editable: false, pageUrl: "" });
    window.close();
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const showFab = e.target.checked;
    chrome.storage.local.set({ showFab }, () => {
      setFabEnabled(showFab);
    });
  };

  return (
    <Paper elevation={0} square sx={{ m: -1, minWidth: 256, pb: 0.5 }}>
      <List dense>
        {token && !error && (
          <>
            <ListItem>
              <ListItemText
                primary={
                  loading && !data ? <Skeleton width="80%" /> : data?.user.name
                }
                secondary={
                  loading && !data ? <Skeleton width="60%" /> : data?.user.email
                }
              />
            </ListItem>
            <Divider sx={{ my: 0.25 }} />
            <ListItemButton
              href={`${process.env.REACT_APP_LOGIN_URL}/dashboard`}
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon>
                <SpeedRounded />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton
              href={`${process.env.REACT_APP_LOGIN_URL}/dashboard?tab=/apps`}
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon>
                <CableRounded />
              </ListItemIcon>
              <ListItemText primary="Connect Apps" />
            </ListItemButton>
            <ListItemButton
              href={`${process.env.REACT_APP_LOGIN_URL}/dashboard?tab=/marks`}
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon>
                <MarkurzIcon />
              </ListItemIcon>
              <ListItemText primary="My Marks" />
            </ListItemButton>
          </>
        )}
        <ListItemButton
          href="https://docs.markurz.com/how-to/setup-and-start"
          target="_blank"
          rel="noreferrer"
        >
          <ListItemIcon>
            <InfoOutlined />
          </ListItemIcon>
          <ListItemText primary="Extension Guide" />
        </ListItemButton>
        <Divider />
        <ListItem>
          <FormControlLabel
            control={
              <Switch
                onChange={handleSwitchChange}
                disabled={fabEnabled === undefined}
                checked={fabEnabled}
              />
            }
            label="Floating Action Button"
            labelPlacement="start"
            slotProps={{
              typography: {
                fontSize: 14,
                flexGrow: 1,
              },
            }}
            sx={{ ml: 0.5, width: "100%" }}
          />
        </ListItem>
        <Divider sx={{ my: 0.25 }} />
        <Box sx={{ px: 2, py: 1 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={handleOpenDrawerButtonClick}
          >
            Mark this page
          </Button>
        </Box>
      </List>
    </Paper>
  );
};

export default ExtensionApp;
