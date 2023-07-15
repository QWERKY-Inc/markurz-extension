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
import { MutationCreateMicrosoftTodoTaskArgs } from "src/generated/graphql";

interface MicrosoftToDoProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_MICROSOFT_TODO_TASKS = graphql(/* GraphQL */ `
  query MicrosoftTodoTaskLists($userModuleId: ID!, $take: Int, $skip: Int) {
    microsoftTodoTaskLists(
      userModuleId: $userModuleId
      take: $take
      skip: $skip
    ) {
      meta {
        totalCount
      }
      elements {
        id
        displayName
      }
    }
  }
`);

const QUERY_MICROSOFT_TODO_CATEGORIES = graphql(/* GraphQL */ `
  query MicrosoftTodoCategories($userModuleId: ID!, $take: Int, $skip: Int) {
    microsoftTodoCategories(
      userModuleId: $userModuleId
      take: $take
      skip: $skip
    ) {
      elements {
        id
        displayName
        color
      }
      meta {
        totalCount
      }
    }
  }
`);

const MicrosoftToDo = (props: MicrosoftToDoProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control } =
    useFormContext<MutationCreateMicrosoftTodoTaskArgs>();
  const { data: dataTodoTasks, loading: loadingTasks } = useQuery(
    QUERY_MICROSOFT_TODO_TASKS,
    {
      variables: {
        userModuleId,
      },
    },
  );
  const { data: dataTodoCategories, loading: loadingCategories } = useQuery(
    QUERY_MICROSOFT_TODO_CATEGORIES,
    {
      variables: {
        userModuleId,
      },
    },
  );
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={3} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an issue in Microsoft To Do
      </Typography>
      <Controller
        render={({ field }) => (
          <TextField
            label="Summary"
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
        {...register("element.content")}
        inputProps={{
          maxLength: 2000,
        }}
      />
      <Controller
        render={({ field }) => (
          <TextField {...field} select label="Select List" required>
            {loadingTasks && <MenuItem disabled>Loading...</MenuItem>}
            {!dataTodoTasks?.microsoftTodoTaskLists.elements?.length &&
              !loadingTasks && <MenuItem disabled>No items</MenuItem>}
            {dataTodoTasks?.microsoftTodoTaskLists.elements?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.displayName}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.taskListId"
        control={control}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <TextField select label="Select Category">
        {loadingCategories && <MenuItem disabled>Loading...</MenuItem>}
        {!dataTodoCategories?.microsoftTodoCategories.elements?.length &&
          !loadingCategories && <MenuItem disabled>No items</MenuItem>}
        {dataTodoCategories?.microsoftTodoCategories.elements?.map((item) => (
          <MenuItem key={item.id}>{item.displayName}</MenuItem>
        ))}
      </TextField>
      <Controller
        render={({ field }) => <DateTimePicker label="Due date" {...field} />}
        name="element.dueDate"
        control={control}
      />
    </Stack>
  );
};

export default MicrosoftToDo;
