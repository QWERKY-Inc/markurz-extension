import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
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
  const { userModuleId } = props;
  const { register, control } =
    useFormContext<MutationCreateGoogleTasksTaskArgs>();
  const { data } = useQuery(QUERY_GOOGLE_TASKS_LIST, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Task in Google Tasks
      </Typography>
      <TextField
        label="Title"
        required
        inputProps={{
          maxLength: 500,
        }}
        {...register("element.title", {
          required: true,
        })}
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
      />
      <Typography color="text.secondary">
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => <DateTimePicker label="Due date" {...field} />}
        name="element.due"
        control={control}
      />
    </Stack>
  );
};

export default GoogleTasks;
