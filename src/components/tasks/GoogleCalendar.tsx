import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  CreateGoogleCalendarEventMutationVariables,
  GoogleCalendarRecurrenceEnum,
  GoogleCalendarReminderEnum,
} from "src/generated/graphql";

const humanizeDuration = require("humanize-duration");

interface GoogleCalendarProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const MINUTE = 60000;
const HOUR = 3.6e6;
const DAY = 8.64e7;

const TIME_KEYS = [
  undefined,
  5 * MINUTE,
  10 * MINUTE,
  15 * MINUTE,
  30 * MINUTE,
  HOUR,
  2 * HOUR,
  DAY,
  2 * DAY,
  0,
];

const GoogleCalendar = (props: GoogleCalendarProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control } =
    useFormContext<CreateGoogleCalendarEventMutationVariables>();
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={3} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an Event in Google Calendar
      </Typography>
      <Controller
        render={({ field }) => (
          <TextField
            label="Title"
            required
            inputProps={{
              maxLength: 500,
            }}
            {...field}
          />
        )}
        name="element.title"
        control={control}
        rules={{ required: true }}
        defaultValue={highlightedText}
      />
      <TextField
        label="Description"
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.description")}
      />
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                required: true,
              },
            }}
            label="Start Date"
            {...field}
          />
        )}
        name="element.startDate"
        control={control}
      />
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                required: true,
              },
            }}
            label="End Date"
            {...field}
          />
        )}
        name="element.endDate"
        control={control}
      />
      <Controller
        render={({ field }) => (
          <TextField select label="Select Repeat" {...field}>
            {Object.entries(GoogleCalendarRecurrenceEnum).map(
              ([key, value]) => (
                <MenuItem key={key} value={value}>
                  {key}
                </MenuItem>
              )
            )}
          </TextField>
        )}
        name="element.recurrences"
        control={control}
        // We can safely ignore this type error because GraphQl converts a string into an array on send
        //@ts-ignore
        defaultValue={GoogleCalendarRecurrenceEnum.Never}
      />
      <Typography color="text.secondary">Notification :</Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Controller
              render={({ field }) => (
                <TextField select label="Notification" fullWidth {...field}>
                  {Object.entries(GoogleCalendarReminderEnum).map(
                    ([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {key}
                      </MenuItem>
                    )
                  )}
                </TextField>
              )}
              name="element.reminders.0.method"
              control={control}
              defaultValue={GoogleCalendarReminderEnum.Notification}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Controller
              render={({ field }) => (
                <TextField select label="Time" fullWidth {...field}>
                  {TIME_KEYS.map((key) => (
                    <MenuItem
                      key={key !== undefined ? key : "none"}
                      value={key !== undefined ? key / MINUTE : "none"}
                    >
                      {key !== undefined
                        ? key === 0
                          ? "At time of event"
                          : `${humanizeDuration(key, {
                              units: ["d", "h", "m"],
                            })} before`
                        : "None"}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              name="element.reminders.0.minutes"
              control={control}
              defaultValue={10}
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default GoogleCalendar;
