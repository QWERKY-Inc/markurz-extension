import { useLazyQuery, useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { CreateMicrosoftOneNotePageMutationVariables } from "src/generated/graphql";

interface MicrosoftOneNoteProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_MICROSOFT_ONENOTE_NOTEBOOKS = graphql(/* GraphQL */ `
  query MicrosoftOneNoteNotebooks($userModuleId: ID!, $take: Int, $skip: Int) {
    microsoftOneNoteNotebooks(
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

const QUERY_MICROSOFT_ONENOTE_SECTIONS = graphql(/* GraphQL */ `
  query MicrosoftOneNoteSections(
    $userModuleId: ID!
    $notebookId: ID!
    $take: Int
    $skip: Int
    $query: String
  ) {
    microsoftOneNoteSections(
      notebookId: $notebookId
      userModuleId: $userModuleId
      take: $take
      skip: $skip
      query: $query
    ) {
      elements {
        id
        label: displayName
      }
      meta {
        totalCount
      }
    }
  }
`);

const MicrosoftOneNote = (props: MicrosoftOneNoteProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control, resetField, watch } = useFormContext<
    CreateMicrosoftOneNotePageMutationVariables & {
      element: { notebookId: string };
    }
  >();
  const notebookId = watch("element.notebookId");
  const { data: dataNotebooks, loading: loadingNotebooks } = useQuery(
    QUERY_MICROSOFT_ONENOTE_NOTEBOOKS,
    {
      variables: {
        userModuleId,
      },
    },
  );
  const [
    querySections,
    { data: dataTodoSections, loading: loadingSections, refetch },
  ] = useLazyQuery(QUERY_MICROSOFT_ONENOTE_SECTIONS);
  register("userModuleId", { value: userModuleId });
  register("element.sectionId", { required: true });

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  useEffect(() => {
    if (notebookId) {
      querySections({
        variables: {
          userModuleId,
          notebookId,
        },
      });
    }
  }, [querySections, notebookId]);

  return (
    <Stack spacing={3} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Page in Microsoft OneNote
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
        {...register("element.content")}
        inputProps={{
          maxLength: 2000,
        }}
      />
      <Controller
        render={({ field: { onChange, ...rest } }) => (
          <TextField
            select
            label="Select Notebook"
            required
            onChange={(e) => {
              resetField("element.sectionId");
              onChange(e.target.value);
            }}
            {...rest}
          >
            {loadingNotebooks && <MenuItem disabled>Loading...</MenuItem>}
            {!dataNotebooks?.microsoftOneNoteNotebooks.elements?.length &&
              !loadingNotebooks && <MenuItem disabled>No items</MenuItem>}
            {dataNotebooks?.microsoftOneNoteNotebooks.elements?.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.displayName}
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.notebookId"
        control={control}
        defaultValue=""
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            disabled={!notebookId}
            loading={loadingSections}
            {...rest}
            noOptionsText="There are no sections available to select. Please add a section in this notebook."
            onChange={(e, data) => {
              onChange(data || "");
            }}
            onInputChange={async (event, value) => {
              if (notebookId) {
                await refetch({
                  query: value,
                  notebookId,
                  userModuleId,
                });
              }
            }}
            value={value}
            options={
              dataTodoSections?.microsoftOneNoteSections.elements?.map(
                (o) => o.id,
              ) ?? []
            }
            getOptionLabel={(option) =>
              dataTodoSections?.microsoftOneNoteSections.elements?.find(
                (o) => o.id === option,
              )?.label || ""
            }
            openOnFocus
            autoComplete={false}
            renderInput={(params) => (
              <TextField {...params} required label="Select Section" />
            )}
          />
        )}
        name="element.sectionId"
        control={control}
        defaultValue=""
      />
    </Stack>
  );
};

export default MicrosoftOneNote;
