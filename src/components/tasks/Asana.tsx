import { useLazyQuery, useQuery } from '@apollo/client';
import { InfoOutlined } from '@mui/icons-material';
import { MenuItem, Stack, StackProps, TextField, Typography } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { graphql } from 'src/generated';
import { MutationCreateAsanaTaskArgs } from 'src/generated/graphql';

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
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<MutationCreateAsanaTaskArgs>();
  const [selectedWorkspace, setSelectedWorkspace] = useState("")
  const [selectedProject, setSelectedProject] = useState("")
  const { data: asanaWorkspacesData } = useQuery(QUERY_ASANA_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  const [fetchAsanaProjects,  {data: asanaProjectsData}] = useLazyQuery(QUERY_ASANA_PROJECTS);
  const [fetchAsanaSections,  {data: asanaSectionsData}] = useLazyQuery(QUERY_ASANA_SECTIONS);
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (selectedWorkspace) {
      fetchAsanaProjects({variables: {userModuleId, workspaceId: selectedWorkspace}})
    }
  }, [selectedWorkspace, fetchAsanaProjects, userModuleId])

  useEffect(() => {
    if (selectedProject) {
      fetchAsanaSections({variables: {userModuleId, projectId: selectedProject}})
    }
  }, [selectedProject, fetchAsanaSections, userModuleId])

  return (
    <Stack spacing={3} {...props}>
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
        render={({field: {onChange, ...rest}}) => (
          <TextField {...rest} label="Select Workspace"  select required onChange={(e) => {onChange(e.target.value); setSelectedWorkspace(e.target.value)}} >
            {asanaWorkspacesData?.asanaWorkspaces?.elements?.map((workspace) => (
              <MenuItem key={workspace.id} value={workspace.id}>
                {workspace.name}
              </MenuItem>
            ))}
            {!asanaWorkspacesData?.asanaWorkspaces?.elements && (
              <MenuItem disabled>
                There are no workspace available to select. Please create a workspace in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.workspaceId"
        rules={{ required: true }}
        control={control}

      />
      <Controller
        render={({field: {onChange, ...rest}}) => (
          <TextField {...rest} label="Select Project" select required disabled={!selectedWorkspace} onChange={(e) => {onChange(e.target.value); setSelectedProject(e.target.value)}}>
            {asanaProjectsData?.asanaProjects.elements?.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
            {!asanaProjectsData?.asanaProjects.elements?.length && (
              <MenuItem disabled>
                There are no projects available to select. Please create a project in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.projectId"
        rules={{ required: true }}
        control={control}
      />
      <Controller
        render={({field}) => (
          <TextField
            {...field}
            label="Select Section"
            select
            //required
            disabled={!selectedProject}
          >
            {asanaSectionsData?.asanaSections.elements?.map((section) => (
              <MenuItem key={section.id} value={section.id}>
                {section.name}
              </MenuItem>
            ))}
            {!asanaSectionsData?.asanaSections.elements?.length && (
              <MenuItem disabled>
                There are no sections available to select. Please create a section in Asana.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.sectionId"
        rules={{ required: true }}
        control={control}
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
      />
    </Stack>
  );
};

export default Asana;
