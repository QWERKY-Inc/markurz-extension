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

interface GoogleCalendarProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const TIME_KEYS = [undefined, 5, 15, 30, 60, 120, 3600, 7200, 0];

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
            {Object.keys(GoogleCalendarRecurrenceEnum).map((key) => (
              <MenuItem key={key} value={key}>
                {key}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.recurrences"
        control={control}
      />
      <Typography color="text.secondary">Notification :</Typography>
      <Box>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6}>
            <Controller
              render={({ field }) => (
                <TextField select label="Notification" fullWidth {...field}>
                  {Object.keys(GoogleCalendarReminderEnum).map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              name="element.reminders"
              control={control}
            />
          </Grid>
          <Grid xs={12} sm={6}>
            <Controller
              render={({ field }) => (
                <TextField select label="Time" fullWidth {...field}>
                  {TIME_KEYS.map((key) => (
                    <MenuItem key={key ?? "none"} value={key ?? "none"}>
                      {key ?? "None"}
                    </MenuItem>
                  ))}
                </TextField>
              )}
              name="element.reminders"
              control={control}
            />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};

export default GoogleCalendar;
