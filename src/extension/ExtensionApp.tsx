import { useMutation, useQuery } from "@apollo/client";
import {
  CableRounded,
  InfoOutlined,
  Logout,
  SpeedRounded,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Skeleton,
} from "@mui/material";
import React from "react";
import MarkurzIcon from "src/components/icons/MarkurzIcon";
import { graphql } from "src/generated";
import { useTokenShared } from "src/lib/token";

const QUERY_ME = graphql(/* GraphQL */ `
  query Me {
    user {
      id
      email
      name
    }
  }
`);

const MUTATION_SIGN_OUT = graphql(/* GraphQL */ `
  mutation SignOut($input: SignOutInput!) {
    signOut(input: $input)
  }
`);

const ExtensionApp = () => {
  const { token } = useTokenShared();
  const { data, loading } = useQuery(QUERY_ME, {
    skip: !token,
  });
  const [signOut, { loading: signOutLoading }] = useMutation(MUTATION_SIGN_OUT);

  console.log("token", token);

  const handleSignOut = async () => {
    try {
      if (token) {
        await signOut({
          variables: {
            input: {
              refreshToken: token,
            },
          },
        });
      }
      await chrome.cookies.remove({
        name: process.env.REACT_APP_COOKIE_NAME as string,
        url: process.env.REACT_APP_LOGIN_URL as string,
      });
    } catch (e) {
      console.error("Failed to sign out:", e);
    }
  };

  return (
    <Paper elevation={0} square sx={{ m: -1, minWidth: 216, pb: 0.5 }}>
      <List dense>
        {token && (
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
              href={`${process.env.REACT_APP_LOGIN_URL}/dashboard/apps`}
              target="_blank"
              rel="noreferrer"
            >
              <ListItemIcon>
                <CableRounded />
              </ListItemIcon>
              <ListItemText primary="Connect Apps" />
            </ListItemButton>
            <ListItemButton
              href={`${process.env.REACT_APP_LOGIN_URL}/dashboard/marks`}
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
        <Divider sx={{ my: 0.25 }} />
        {token ? (
          <ListItemButton onClick={handleSignOut} disabled={signOutLoading}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        ) : (
          <Box sx={{ px: 2, py: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              size="small"
              href={`${process.env.REACT_APP_LOGIN_URL}/login`}
              target="_blank"
              rel="noreferrer"
            >
              Sign In
            </Button>
          </Box>
        )}
      </List>
    </Paper>
  );
};

export default ExtensionApp;
