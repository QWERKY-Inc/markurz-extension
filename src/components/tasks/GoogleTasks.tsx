import {
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";

interface GoogleTasksProps extends StackProps {}

const GoogleTasks = (props: GoogleTasksProps) => {
  const { register, control } = useFormContext();

  return (
    <Stack spacing={2} {...props}>
      <Typography>Create a Task in Google Tasks</Typography>
      <TextField
        label="Title"
        required
        {...register("title", { required: true })}
      />
      <TextField label="Details" multiline {...register("details")} />
      <Controller
        render={({ field }) => (
          <TextField select label="Select List" required {...field}>
            <MenuItem value="value">Value</MenuItem>
          </TextField>
        )}
        name="list"
        control={control}
      />
      <Typography>Additional Information (optional)</Typography>
      <Controller
        render={({ field }) => <DatePicker label="Due date" {...field} />}
        name="date"
        control={control}
      />
      <Controller
        render={({ field }) => <TimePicker label="Set time" {...field} />}
        name="time"
        control={control}
      />
    </Stack>
  );
};

export default GoogleTasks;
