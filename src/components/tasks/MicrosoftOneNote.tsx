import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
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
  ) {
    microsoftOneNoteSections(
      notebookId: $notebookId
      userModuleId: $userModuleId
      take: $take
      skip: $skip
    ) {
      elements {
        id
        displayName
      }
      meta {
        totalCount
      }
    }
  }
`);

const MicrosoftOneNote = (props: MicrosoftOneNoteProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control } =
    useFormContext<CreateMicrosoftOneNotePageMutationVariables>();
  const [notebookId, setNotebookId] = useState("");
  const { data: dataNotebooks, loading: loadingNotebooks } = useQuery(
    QUERY_MICROSOFT_ONENOTE_NOTEBOOKS,
    {
      variables: {
        userModuleId,
      },
    },
  );
  const { data: dataTodoCategories, loading: loadingCategories } = useQuery(
    QUERY_MICROSOFT_ONENOTE_SECTIONS,
    {
      variables: {
        userModuleId,
        notebookId,
      },
      skip: !notebookId,
    },
  );
  register("userModuleId", { value: userModuleId });

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
      <TextField
        select
        label="Select Notebook"
        required
        value={notebookId}
        onChange={(e) => setNotebookId(e.target.value)}
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
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            {...rest}
            loading={loadingCategories}
            onChange={(e, data) => {
              onChange(data as string);
            }}
            value={value}
            options={
              dataTodoCategories?.microsoftOneNoteSections.elements?.map(
                (o) => o.displayName,
              ) ?? []
            }
            disableCloseOnSelect
            openOnFocus
            autoComplete={false}
            renderInput={(params) => (
              <TextField {...params} required label="Select Section" />
            )}
          />
        )}
        name="element.sectionId"
        control={control}
      />
    </Stack>
  );
};

export default MicrosoftOneNote;
