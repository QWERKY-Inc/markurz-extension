import { useQuery } from "@apollo/client";
import {
  Autocomplete,
  ListItemText,
  Stack,
  StackProps,
  TextField,
} from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TaskTitle from "src/components/formComponents/TaskTitle";
import { graphql } from "src/generated";
import {
  CreateNotionPageMutationVariables,
  NotionObjectTypeEnum,
} from "src/generated/graphql";

interface NotionProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_NOTION_OBJECTS = graphql(/* GraphQL */ `
  query NotionObjects($userModuleId: ID!, $title: String) {
    notionResources(userModuleId: $userModuleId, keyword: $title) {
      pages {
        elements {
          id
          title
          type
          navigationPath {
            elements {
              title
              id
            }
            meta {
              totalCount
            }
          }
        }
        meta {
          totalCount
        }
      }
      databases {
        meta {
          totalCount
        }
        elements {
          id
          title
          type
          navigationPath {
            meta {
              totalCount
            }
            elements {
              id
              title
            }
          }
        }
      }
    }
  }
`);

function getPathRepresentation(
  paths: Array<string | null | undefined> | undefined,
) {
  const purgedPaths = paths?.filter((o) => o);
  if (!purgedPaths?.length) return null;
  if (purgedPaths.length === 1) {
    return purgedPaths[0];
  }
  return [purgedPaths[0], purgedPaths[purgedPaths.length - 1]].join(
    purgedPaths.length > 2 ? "/../" : "/",
  );
}

const Notion = (props: NotionProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, setValue, control, resetField } =
    useFormContext<CreateNotionPageMutationVariables>();
  const { data, loading, refetch } = useQuery(QUERY_NOTION_OBJECTS, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });
  register("element.parentId", { required: true });
  register("element.parentType", { required: true });

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  return (
    <Stack spacing={2} {...stackProps}>
      <TaskTitle content="Create a New Page in Notion" />
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
          setValue("element.parentId", data?.id || "");
          setValue(
            "element.parentType",
            data?.type || NotionObjectTypeEnum.Page,
            {
              shouldValidate: true,
            },
          );
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
        groupBy={(o) => o.type}
        options={
          data
            ? [
                ...(data?.notionResources.databases.elements ?? []),
                ...(data.notionResources.pages.elements ?? []),
              ]
            : []
        }
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              <ListItemText
                primary={option.title || "Untitled"}
                secondary={getPathRepresentation(
                  option.navigationPath.elements?.map((o) => o.title),
                )}
              />
            </li>
          );
        }}
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
