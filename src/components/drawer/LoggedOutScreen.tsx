import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";
import { openSignInWindow } from "src/lib/token";

interface LoggedOutScreenProps {
  loading: boolean;
}

const LoggedOutScreen = ({ loading }: LoggedOutScreenProps) => {
  return (
    <Stack
      spacing={3}
      justifyContent="center"
      px={2}
      alignItems="center"
      height="100%"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5">You are not signed in.</Typography>
          <Typography align="center">
            Please sign in or sign up to Markurz to start marking and sending
            tasks, reminders and notes to your favorite productivity apps!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openSignInWindow()}
          >
            Sign in or sign up
          </Button>
        </>
      )}
    </Stack>
  );
};

export default LoggedOutScreen;
