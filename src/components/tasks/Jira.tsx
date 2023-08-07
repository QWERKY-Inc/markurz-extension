import { useLazyQuery, useQuery } from "@apollo/client";
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
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MutationCreateJiraIssueArgs } from "src/generated/graphql";

interface JiraProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_JIRA_DATA = graphql(/* GraphQL */ `
  query JiraInformation($userModuleId: ID!, $siteId: ID!) {
    jiraInformation(userModuleId: $userModuleId, siteId: $siteId) {
      labels
      projects {
        id
        name
        key
        issueTypes {
          id
          name
        }
      }
    }
  }
`);

const QUERY_JIRA_SITES = graphql(/* GraphQL */ `
  query JiraSites($userModuleId: ID!) {
    jiraSitesNew(userModuleId: $userModuleId) {
      elements {
        id
        name
        url
      }
      meta {
        totalCount
      }
    }
  }
`);

const QUERY_JIRA_USERS = graphql(/* GraphQL */ `
  query JiraUsers(
    $userModuleId: ID!
    $siteId: ID!
    $take: Int
    $projectKey: String!
    $query: String
  ) {
    jiraUsers(
      userModuleId: $userModuleId
      siteId: $siteId
      take: $take
      projectKey: $projectKey
      query: $query
    ) {
      elements {
        id
        displayName
        active
        accountType
      }
    }
  }
`);

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Jira = (props: JiraProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control, watch, resetField } =
    useFormContext<MutationCreateJiraIssueArgs>();
  const siteId = watch("element.siteId");
  const projectKey = watch("element.projectKey");
  const [queryJiraData, { data }] = useLazyQuery(QUERY_JIRA_DATA);
  const [fetchUserData, { refetch: refetchUserData, data: usersData, loading: userDataLoading }] =
    useLazyQuery(QUERY_JIRA_USERS);
  const { data: dataSites } = useQuery(QUERY_JIRA_SITES, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (siteId && userModuleId) {
      queryJiraData({
        variables: {
          userModuleId,
          siteId,
        },
      });
    }
  }, [queryJiraData, siteId, userModuleId]);

  useEffect(() => {
    if (highlightedText) {
      resetField("element.summary", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  useEffect(() => {
    resetField("element.projectKey");
    resetField("element.labels");
  }, [resetField, siteId]);

  useEffect(() => {
    resetField("element.issueTypeId");
    if (userModuleId && siteId && projectKey) {
      fetchUserData({ variables: { userModuleId, siteId, projectKey } });
    }
  }, [resetField, fetchUserData, userModuleId, siteId, projectKey]);

  return (
    <Stack spacing={3} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an issue in Jira
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
        name="element.summary"
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
          <TextField label="Select Site" select required {...field}>
            {dataSites?.jiraSitesNew.elements?.map((jiraSite) => (
              <MenuItem key={jiraSite.id} value={jiraSite.id}>
                {jiraSite.name}
              </MenuItem>
            ))}
            {!dataSites?.jiraSitesNew.elements?.length && (
              <MenuItem disabled>
                There are no sites available to select
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.siteId"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        render={({ field }) => (
          <TextField
            label="Select Project"
            disabled={!siteId}
            select
            required
            {...field}
          >
            {data?.jiraInformation.projects.map((project) => (
              <MenuItem key={project.id} value={project.key}>
                {project.name}
              </MenuItem>
            ))}
            {!data?.jiraInformation.projects.length && (
              <MenuItem disabled>
                There are no projects available to select. Please create a
                project in Jira.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.projectKey"
        control={control}
        rules={{ required: true }}
        defaultValue=""
      />
      <Controller
        render={({ field }) => (
          <TextField
            label="Select Type"
            select
            required
            disabled={!projectKey}
            {...field}
          >
            {data?.jiraInformation.projects
              .find((o) => o.key === projectKey)
              ?.issueTypes.map((issueType) => (
                <MenuItem key={issueType.id} value={issueType.id}>
                  {issueType.name}
                </MenuItem>
              ))}
            {!data?.jiraInformation.projects.find((o) => o.key === projectKey)
              ?.issueTypes.length && (
              <MenuItem disabled>
                There are no types available to select
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.issueTypeId"
        control={control}
        rules={{ required: true }}
        defaultValue=""
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
            disableCloseOnSelect
          />
        )}
        name="element.labels"
        control={control}
        defaultValue={[]}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <Controller
        name="element.assigneeId"
        control={control}
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            {...rest}
            value={usersData?.jiraUsers.elements?.find(
              (elem) => elem.id === value,
            ) ?? null}
            options={usersData?.jiraUsers.elements ?? []}
            getOptionLabel={(o) => o.displayName}
            renderInput={(params) => (
              <TextField {...params} label="Select Assignee" />
            )}
            disabled={!projectKey}
            loading={userDataLoading}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={(_, data) => onChange(data?.id ?? undefined)}
            onInputChange={(_, value) => {
              refetchUserData({ query: value });
            }}
          />
        )}
      />
    </Stack>
  );
};

export default Jira;
