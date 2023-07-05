import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Checkbox,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MutationCreateEvernoteNoteArgs } from "src/generated/graphql";

interface EvernoteProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const QUERY_EVERNOTE_DATA = graphql(/* GraphQL */ `
  query EvernoteData($userModuleId: ID!) {
    evernoteNotebooks(userModuleId: $userModuleId) {
      meta {
        totalCount
      }
      elements {
        id
        name
        stack
      }
    }
    evernoteTags(userModuleId: $userModuleId) {
      meta {
        totalCount
      }
      elements {
        id
        name
      }
    }
  }
`);

const Evernote = (props: EvernoteProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { data: dataNotebooks } = useQuery(QUERY_EVERNOTE_DATA);
  const { register, control } =
    useFormContext<MutationCreateEvernoteNoteArgs>();

  return (
    <Stack spacing={2} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Note in Evernote
      </Typography>
      <TextField
        label="Title"
        required
        inputProps={{
          maxLength: 500,
        }}
        {...register("element.title", {
          required: true,
          value: highlightedText,
        })}
      />
      <TextField
        label="Content"
        multiline
        inputProps={{
          maxLength: 255,
        }}
        {...register("element.content")}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
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
            options={dataNotebooks?.evernoteTags.elements ?? []}
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
              <TextField {...params} variant="outlined" label="Select Tags" />
            )}
          />
        )}
        name="element.tagNames"
        control={control}
      />
    </Stack>
  );
};

export default Evernote;
