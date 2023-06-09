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
  highlightedText: string;
}

const QUERY_JIRA_DATA = graphql(/* GraphQL */ `
  query JiraInformation($userModuleId: ID!) {
    jiraInformation(userModuleId: $userModuleId) {
      labels
      projects {
        id
        name
        key
        issuetypes {
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
  const { userModuleId, highlightedText } = props;
  const { data } = useQuery(QUERY_JIRA_DATA, {
    variables: {
      userModuleId,
    },
  });
  const { register, control, watch } =
    useFormContext<MutationCreateJiraIssueArgs>();
  const projectKey = watch("element.projectKey");
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={3} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an issue in Jira
      </Typography>
      <TextField
        label="Summary"
        required
        {...register("element.summary", {
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
          <TextField label="Select Project" select required {...field}>
            {data?.jiraInformation.projects.map((project) => (
              <MenuItem key={project.id} value={project.key}>
                {project.name}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.projectKey"
        control={control}
      />
      <Controller
        render={({ field }) => (
          <TextField label="Select Type" select {...field}>
            {data?.jiraInformation.projects
              .find((o) => o.key === projectKey)
              ?.issuetypes.map((issueType) => (
                <MenuItem key={issueType.id} value={issueType.id}>
                  {issueType.name}
                </MenuItem>
              ))}
          </TextField>
        )}
        name="element.issueTypeId"
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
