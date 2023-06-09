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
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MutationCreateJiraIssueArgs } from "src/generated/graphql";

interface JiraProps extends StackProps {
  userModuleId: string;
}

const QUERY_JIRA_DATA = graphql(/* GraphQL */ `
  query JiraInformation {
    jiraInformation {
      labels
      projects {
        id
        name
        issueTypes {
          id
          name
        }
      }
    }
  }
`);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Jira = (props: JiraProps) => {
  const { data } = useQuery(QUERY_JIRA_DATA);
  const { register, control } = useFormContext<MutationCreateJiraIssueArgs>();

  return (
    <Stack {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an issue in Jira
      </Typography>
      <TextField
        label="Summary"
        required
        {...register("element.summary", { required: true })}
      />
      <TextField
        label="Description"
        multiline
        {...register("element.description")}
      />
      <TextField
        label="Select Project"
        select
        {...register("element.projectKey", { required: true })}
      >
        {data?.jiraInformation.projects.map((project) => (
          <MenuItem key={project.id}>{project.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Select Type"
        select
        {...register("element.issueTypeId", { required: true })}
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
            options={data?.jiraInformation.labels ?? []}
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
    </Stack>
  );
};

export default Jira;
