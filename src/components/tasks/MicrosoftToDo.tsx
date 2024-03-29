import { useQuery } from "@apollo/client";
import { Circle } from "@mui/icons-material";
import {
  Autocomplete,
  Chip,
  chipClasses,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TaskTitle from "src/components/formComponents/TaskTitle";
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
  const { register, control, resetField } =
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

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  return (
    <Stack spacing={3} {...stackProps}>
      <TaskTitle content="Create a task in Microsoft To Do" />
      <Controller
        render={({ field }) => (
          <TextField
            label="Title"
            required
            inputProps={{
              maxLength: 255,
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
        label="Note"
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
        defaultValue=""
        rules={{ required: true }}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            {...rest}
            loading={loadingCategories}
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || []}
            options={
              dataTodoCategories?.microsoftTodoCategories.elements?.map(
                (o) => o.displayName,
              ) ?? []
            }
            disableCloseOnSelect
            openOnFocus
            autoComplete={false}
            renderInput={(params) => (
              <TextField {...params} label="Select Category" />
            )}
            renderOption={(props, option, { selected }) => {
              const icon =
                dataTodoCategories?.microsoftTodoCategories.elements?.find(
                  (o) => o.displayName === option,
                );
              return (
                <MenuItem selected={selected} {...props}>
                  {icon && (
                    <ListItemIcon>
                      <Circle sx={{ color: icon.color }} />
                    </ListItemIcon>
                  )}
                  <ListItemText>{option}</ListItemText>
                </MenuItem>
              );
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const icon =
                  dataTodoCategories?.microsoftTodoCategories.elements?.find(
                    (o) => o.displayName === option,
                  );
                return (
                  <Chip
                    sx={{
                      [`& > .${chipClasses.icon}`]: {
                        color: icon?.color,
                      },
                    }}
                    icon={icon ? <Circle /> : undefined}
                    label={option}
                    size="small"
                    {...getTagProps({ index })}
                  />
                );
              })
            }
          />
        )}
        name="element.categoryNames"
        control={control}
        defaultValue={null}
      />
      <Controller
        render={({ field }) => (
          <DesktopDatePicker
            slotProps={{
              actionBar: {
                actions: ["clear", "accept"],
              },
            }}
            disablePast
            label="Due date"
            {...field}
          />
        )}
        name="element.dueDate"
        control={control}
        defaultValue={null}
      />
    </Stack>
  );
};

export default MicrosoftToDo;
