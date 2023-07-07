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
import { useFormContext } from "react-hook-form";
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
      }
    }
  }
`);

const Notion = (props: NotionProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register } = useFormContext<CreateNotionPageMutationVariables>();
  const { data } = useQuery(QUERY_NOTION_OBJECTS, {
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
      <TextField
        label="Title"
        required
        inputProps={{
          maxLength: 255,
        }}
        {...register("element.title", {
          required: true,
          value: highlightedText,
        })}
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
        // onChange={(e, data) => {
        //   onChange(data);
        // }}
        // value={value || undefined}
        //{...rest}
        getOptionLabel={(o) => o.title}
        groupBy={(o) => o.__typename || ""}
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
            label="Select Pages or Databases"
          />
        )}
      />
    </Stack>
  );
};

export default Notion;
