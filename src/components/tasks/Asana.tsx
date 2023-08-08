import { useLazyQuery, useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MutationCreateAsanaTaskArgs } from "src/generated/graphql";

interface AsanaProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_ASANA_WORKSPACES = graphql(/* GraphQL */ `
  query AsanaWorkspaces($userModuleId: ID!) {
    asanaWorkspaces(userModuleId: $userModuleId) {
      elements {
        id
        name
      }
    }
  }
`);

const QUERY_ASANA_PROJECTS = graphql(/* GraphQL */ `
  query AsanaProjects($userModuleId: ID!, $workspaceId: ID!) {
    asanaProjects(userModuleId: $userModuleId, workspaceId: $workspaceId) {
      elements {
        id
        name
      }
    }
  }
`);

const QUERY_ASANA_SECTIONS = graphql(/* GraphQL */ `
  query AsanaSections($userModuleId: ID!, $projectId: ID!) {
    asanaSections(userModuleId: $userModuleId, projectId: $projectId) {
      elements {
        id
        name
      }
    }
  }
`);

const Asana = (props: AsanaProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const {
    register,
    control,
    resetField,
    watch,
    formState: { errors },
  } = useFormContext<MutationCreateAsanaTaskArgs>();
  const { data: asanaWorkspacesData } = useQuery(QUERY_ASANA_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  const selectedWorkspace = watch("element.workspaceId");
  const selectedProject = watch("element.projectId");
  const [fetchAsanaProjects, { data: asanaProjectsData }] =
    useLazyQuery(QUERY_ASANA_PROJECTS);
  const [fetchAsanaSections, { data: asanaSectionsData }] =
    useLazyQuery(QUERY_ASANA_SECTIONS);
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (highlightedText) {
      resetField("element.name", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  useEffect(() => {
    resetField("element.projectId");
    if (selectedWorkspace) {
      fetchAsanaProjects({
        variables: { userModuleId, workspaceId: selectedWorkspace },
      });
    }
  }, [selectedWorkspace, fetchAsanaProjects, userModuleId, resetField]);

  useEffect(() => {
    resetField("element.sectionId");
    if (selectedProject) {
      fetchAsanaSections({
        variables: { userModuleId, projectId: selectedProject },
      });
    }
  }, [selectedProject, fetchAsanaSections, userModuleId, resetField]);

  return (
    <Stack spacing={3} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an Task in Asana
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
        name="element.name"
        control={control}
        rules={{ required: true }}
        defaultValue={highlightedText}
      />
      <TextField
        label="Description"
        multiline
        {...register("element.notes")}
        inputProps={{
          maxLength: 2000,
        }}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            {...rest}
            value={value}
            label="Select Workspace"
            select
            required
            onChange={(e) => {
              resetField("element.projectId");
              onChange(e.target.value);
            }}
          >
            {asanaWorkspacesData?.asanaWorkspaces?.elements?.map(
              (workspace) => (
                <MenuItem key={workspace.id} value={workspace.id}>
                  {workspace.name}
                </MenuItem>
              ),
            )}
            {!asanaWorkspacesData?.asanaWorkspaces?.elements && (
              <MenuItem disabled>
                There are no workspace available to select. Please create a
                workspace in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.workspaceId"
        rules={{ required: true }}
        control={control}
        defaultValue=""
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            {...rest}
            value={value}
            label="Select Project"
            select
            required
            disabled={!selectedWorkspace}
            onChange={(e) => {
              resetField("element.sectionId");
              onChange(e.target.value);
            }}
          >
            {asanaProjectsData?.asanaProjects.elements?.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
            {!asanaProjectsData?.asanaProjects.elements?.length && (
              <MenuItem disabled>
                There are no projects available to select. Please create a
                project in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.projectId"
        rules={{ required: true }}
        control={control}
        defaultValue=""
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            {...rest}
            value={value}
            label="Select Section"
            select
            required
            disabled={!selectedProject}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          >
            {asanaSectionsData?.asanaSections.elements?.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
            {!asanaSectionsData?.asanaSections.elements?.length && (
              <MenuItem disabled>
                There are no sections available to select. Please create a
                section in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.sectionId"
        rules={{ required: true }}
        control={control}
        defaultValue=""
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                size: "small",
                error: !!errors.element?.dueDate,
                helperText: errors.element?.dueDate?.message?.toString(),
              },
              actionBar: {
                actions: ["clear", "accept"],
              },
            }}
            label="Due date"
            {...field}
          />
        )}
        name="element.dueDate"
        control={control}
        defaultValue={null}
        rules={{
          validate(value) {
            if (value && !value.isValid()) return "Invalid date";
            return true;
          },
        }}
      />
    </Stack>
  );
};

export default Asana;
