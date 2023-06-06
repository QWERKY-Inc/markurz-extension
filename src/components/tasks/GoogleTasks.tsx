import { Stack, StackProps, TextField, Typography } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";

interface GoogleTasksProps extends StackProps {}

const GoogleTasks = (props: GoogleTasksProps) => {
  return (
    <Stack spacing={2} {...props}>
      <Typography>Create a Task in Google Tasks</Typography>
      <TextField label="Title" required />
      <TextField label="Details" multiline />
      <TextField select label="Select List" required />
      <Typography>Additional Information (optional)</Typography>
      <DatePicker label="Due date" />
      <TimePicker label="Set time" />
    </Stack>
  );
};

export default GoogleTasks;
