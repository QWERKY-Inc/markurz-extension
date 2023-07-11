import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { CreateNotionPageMutationVariables } from "src/generated/graphql";

interface NotionProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_NOTION_OBJECTS = graphql(/* GraphQL */ `
  query NotionObjects($userModuleId: ID!, $title: String) {
    databases: notionObjects(
      userModuleId: $userModuleId
      parentType: DATABASE
      title: $title
    ) {
      meta {
        totalCount
      }
      elements {
        id
        title
        parentType
      }
    }
    pages: notionObjects(
      userModuleId: $userModuleId
      parentType: PAGE
      title: $title
    ) {
      meta {
        totalCount
      }
      elements {
        id
        title
        parentType
      }
    }
  }
`);

const Notion = (props: NotionProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, setValue, control } =
    useFormContext<CreateNotionPageMutationVariables>();
  const { data, loading, refetch } = useQuery(QUERY_NOTION_OBJECTS, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a New Page in Notion
      </Typography>
      <Controller
        render={({ field }) => (
          <TextField
            label="Title"
            required
            inputProps={{
              maxLength: 255,
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
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.content")}
      />
      <Autocomplete
        onChange={(e, data) => {
          if (data) {
            setValue("element.parentId", data.id);
            setValue("element.parentType", data.parentType);
          }
        }}
        filterOptions={(x) => x}
        onInputChange={async (event, value) => {
          await refetch({
            title: value,
          });
        }}
        openOnFocus
        loading={loading}
        getOptionLabel={(o) => o.title || "Untitled"}
        groupBy={(o) => o.parentType}
        options={
          data
            ? [
                ...(data?.databases.elements ?? []),
                ...(data.pages.elements ?? []),
              ]
            : []
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Page or Database"
            placeholder="Search pages or databases"
            required
          />
        )}
      />
    </Stack>
  );
};

export default Notion;
