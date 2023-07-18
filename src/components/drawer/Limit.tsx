import { Button, Stack, Typography } from "@mui/material";
import React from "react";
import NotFoundIcon from "src/components/icons/NotFoundIcon";

const Limit = () => {
  return (
    <Stack
      spacing={5}
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      p={3}
    >
      <Typography variant="h5" align="center">
        You’ve Reached Monthly Limit
      </Typography>
      <NotFoundIcon color="warning" width={120} height={120} />
      <Typography variant="subtitle2" align="center">
        You have reached monthly limit of 30 Mark Sends. If you would like to
        send unlimited tasks, reminders and notes, subscribe to Markurz Plus
        Plan.
      </Typography>
      <div>
        <Button variant="contained">upgrade</Button>
      </div>
    </Stack>
  );
};

export default Limit;
