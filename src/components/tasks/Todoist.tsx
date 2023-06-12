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
  const { userModuleId, highlightedText } = props;
  const { register, control } = useFormContext<MutationCreateTodoistTaskArgs>();
  const { data } = useQuery(QUERY_TODOIST_INFOS, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Task in Todoist
      </Typography>
      <TextField
        label="Title"
        required
        {...register("element.title", {
          required: true,
          value: highlightedText,
        })}
      />
      <TextField
        label="Description"
        multiline
        {...register("element.description")}
      />
      <Controller
        render={({ field }) => (
          <TextField select label="Select Project" required {...field}>
            {data?.todoistProjects.elements?.map((todoistProject) => (
              <MenuItem key={todoistProject.id} value={todoistProject.id}>
                {todoistProject.title}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.todoistProjectId"
        control={control}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || undefined}
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
              <TextField {...params} variant="outlined" label="Select Labels" />
            )}
          />
        )}
        name="element.labels"
        control={control}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
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

export default Todoist;
