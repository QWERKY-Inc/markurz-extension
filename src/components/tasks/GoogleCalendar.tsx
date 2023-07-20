import { Close, InfoOutlined } from '@mui/icons-material';
import { Button, IconButton, MenuItem, Stack, StackProps, TextField, Tooltip, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { DateTimePicker } from '@mui/x-date-pickers';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  CreateGoogleCalendarEventMutationVariables,
  GoogleCalendarRecurrenceEnum,
  GoogleCalendarReminderEnum,
} from 'src/generated/graphql';

const humanizeDuration = require("humanize-duration");

interface GoogleCalendarProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const MINUTE = 60000;
const HOUR = 3.6e6;
const DAY = 8.64e7;

const TIME_KEYS = [
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
  const {
    register,
    control,
    formState: { errors },
    clearErrors,
  } = useFormContext<CreateGoogleCalendarEventMutationVariables>();
  register("userModuleId", { value: userModuleId });
  const { append, remove, fields, update } = useFieldArray({
    control,
    name: "element.reminders",
  });

  useEffect(() => {
    // Registers one default value
    const value = {
      minutes: TIME_KEYS[1] / MINUTE,
      method: GoogleCalendarReminderEnum.Notification,
    };
    register("element.reminders.0", {
      value,
    });
    update(0, value);
  }, [register, update]);

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
                error: !!errors.element?.startDate,
                helperText: errors.element?.startDate?.message?.toString(),
              },
            }}
            label="Start Date"
            {...field}
          />
        )}
        name="element.startDate"
        control={control}
        defaultValue={moment().add(1, "hour").startOf("hour")}
        rules={{
          validate(value, formValues) {
            clearErrors("element.endDate");
            return value > formValues.element.endDate
              ? "The start date must be before the end date"
              : true;
          },
        }}
      />
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                required: true,
                error: !!errors.element?.endDate,
                helperText: errors.element?.endDate?.message?.toString(),
              },
            }}
            label="End Date"
            {...field}
          />
        )}
        name="element.endDate"
        control={control}
        defaultValue={moment()
          .add(1, "hour")
          .startOf("hour")
          .add(15, "minutes")}
        rules={{
          validate(value, formValues) {
            clearErrors("element.startDate");
            return value < formValues.element.startDate
              ? "The end date must be after the start date"
              : true;
          },
        }}
      />
      <Controller
        render={({ field }) => (
          <TextField select label="Select Repeat" {...field}>
            {Object.entries(GoogleCalendarRecurrenceEnum).map(
              ([key, value]) => (
                <MenuItem key={key} value={value}>
                  {key}
                </MenuItem>
              ),
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
      <Stack spacing={2}>
        {fields.map((item, idx) => (
          <Stack spacing={1} key={item.id} direction="row">
            <Grid xs>
              <Controller
                render={({ field }) => (
                  <TextField select label="Notification" fullWidth {...field}>
                    {Object.entries(GoogleCalendarReminderEnum).map(
                      ([key, value]) => (
                        <MenuItem key={key} value={value}>
                          {key}
                        </MenuItem>
                      ),
                    )}
                  </TextField>
                )}
                name={`element.reminders.${idx}.method`}
                control={control}
              />
            </Grid>
            <Grid xs>
              <Controller
                render={({ field }) => (
                  <TextField select label="Time" fullWidth {...field}>
                    {TIME_KEYS.map((key) => (
                      <MenuItem key={key} value={key / MINUTE}>
                        {key === 0
                          ? "At time of event"
                          : `${humanizeDuration(key, {
                              units: ["d", "h", "m"],
                            })} before`}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
                name={`element.reminders.${idx}.minutes`}
                control={control}
              />
            </Grid>
            <Grid xs="auto">
              <Tooltip title="Remove notification" placement="top">
                <IconButton onClick={() => remove(idx)}>
                  <Close />
                </IconButton>
              </Tooltip>
            </Grid>
          </Stack>
        ))}
        <div>
          <Button
            color="inherit"
            // Calendar cannot handle more than 5 notifications
            disabled={fields.length >= 5}
            onClick={() => {
              // + 1 because we want to skip the 10 minutes, as it is the default
              if (fields.length + 1 < TIME_KEYS.length) {
                append({
                  method: GoogleCalendarReminderEnum.Notification,
                  minutes: TIME_KEYS[fields.length + 1],
                });
              }
            }}
          >
            Add notification
          </Button>
        </div>
      </Stack>
    </Stack>
  );
};

export default GoogleCalendar;
