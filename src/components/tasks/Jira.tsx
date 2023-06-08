import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
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

const Jira = (props: JiraProps) => {
  const { data } = useQuery(QUERY_JIRA_DATA);
  const { register } = useFormContext<MutationCreateJiraIssueArgs>();

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
      <TextField
        label="Select Labels"
        select
        {...register("element.labels", { required: true })}
      >
        {data?.jiraInformation.labels.map((label) => (
          <MenuItem key={label}>{label}</MenuItem>
        ))}
      </TextField>
    </Stack>
  );
};

export default Jira;
