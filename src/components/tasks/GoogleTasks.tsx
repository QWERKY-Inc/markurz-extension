import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
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
import { graphql } from "src/generated";
import { MutationCreateGoogleTasksTaskArgs } from "src/generated/graphql";

interface GoogleTasksProps extends StackProps {
  userModuleId: string;
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
        {...register("element.title", { required: true })}
      />
      <TextField label="Details" multiline {...register("element.notes")} />
      <Controller
        render={({ field }) => (
          <TextField select label="Select List" required {...field}>
            {data?.googleTasksTaskLists.elements?.map((googleTaskElement) => (
              <MenuItem key={googleTaskElement.id} value={googleTaskElement.id}>
                {googleTaskElement.title}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.googleTaskListId"
        control={control}
      />
      <Typography color="text.secondary">
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => <DatePicker label="Due date" {...field} />}
        name="element.due"
        control={control}
      />
      <Controller
        render={({ field }) => <TimePicker label="Set time" {...field} />}
        name="element.due"
        control={control}
      />
    </Stack>
  );
};

export default GoogleTasks;
