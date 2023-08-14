import { useQuery } from "@apollo/client";
import {
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TaskTitle from "src/components/formComponents/TaskTitle";
import { graphql } from "src/generated";
import { MutationCreateGoogleTasksTaskArgs } from "src/generated/graphql";

interface GoogleTasksProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_GOOGLE_TASKS_LIST = graphql(/* GraphQL */ `
  query GoogleTasksTaskLists($userModuleId: ID!) {
    googleTasksTaskLists(userModuleId: $userModuleId) {
      meta {
        nextPageToken
      }
      elements {
        id
        title
      }
    }
  }
`);

const GoogleTasks = (props: GoogleTasksProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control, resetField } =
    useFormContext<MutationCreateGoogleTasksTaskArgs>();
  const { data } = useQuery(QUERY_GOOGLE_TASKS_LIST, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  return (
    <Stack spacing={2} {...stackProps}>
      <TaskTitle content="Create a Task in Google Tasks" />
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
        label="Details"
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.notes")}
      />
      <Controller
        render={({ field }) => (
          <TextField select label="Select List" required {...field}>
            {data?.googleTasksTaskLists.elements?.map((googleTaskElement) => (
              <MenuItem key={googleTaskElement.id} value={googleTaskElement.id}>
                {googleTaskElement.title}
              </MenuItem>
            )) ?? (
              <MenuItem disabled>
                There are no list available to select
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.googleTaskListId"
        control={control}
        defaultValue=""
        rules={{ required: true }}
      />
      <Typography color="text.secondary">
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              actionBar: {
                actions: ["clear", "accept"],
              },
            }}
            label="Due date"
            {...field}
          />
        )}
        name="element.due"
        control={control}
        defaultValue={null}
      />
    </Stack>
  );
};

export default GoogleTasks;
