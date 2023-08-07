import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Checkbox,
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
import { MutationCreateTodoistTaskArgs } from "src/generated/graphql";

interface TodoistProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const QUERY_TODOIST_INFOS = graphql(/* GraphQL */ `
  query TodoistInfos($userModuleId: ID!) {
    todoistLabels(userModuleId: $userModuleId) {
      meta {
        totalCount
      }
      elements {
        id
        title
      }
    }
    todoistProjects(userModuleId: $userModuleId) {
      meta {
        totalCount
      }
      elements {
        id
        title
      }
    }
  }
`);

const Todoist = (props: TodoistProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control, watch } =
    useFormContext<MutationCreateTodoistTaskArgs>();
  const { data } = useQuery(QUERY_TODOIST_INFOS, {
    variables: {
      userModuleId,
    },
  });
  const watchLabels = watch("element.labels");
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Task in Todoist
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
        {...register("element.description")}
        inputProps={{
          maxLength: 2000,
        }}
      />
      <Controller
        render={({ field }) => (
          <TextField select label="Select Project" required {...field}>
            {!data?.todoistProjects?.elements?.length && (
              <MenuItem disabled>No projects available</MenuItem>
            )}
            {data?.todoistProjects.elements?.map((todoistProject) => (
              <MenuItem key={todoistProject.id} value={todoistProject.id}>
                {todoistProject.title}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.todoistProjectId"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            freeSolo={Boolean(!watchLabels || watchLabels.length < 500)}
            getOptionDisabled={() =>
              Boolean(watchLabels && watchLabels.length >= 500)
            }
            multiple
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || []}
            {...rest}
            options={
              data?.todoistLabels.elements?.map((element) => element.title) ??
              []
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Select Labels"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 60,
                }}
              />
            )}
          />
        )}
        name="element.labels"
        control={control}
        defaultValue={null}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
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

export default Todoist;
