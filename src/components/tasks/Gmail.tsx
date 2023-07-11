import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Stack,
  StackProps,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { CreateGmailEmailMutationVariables } from "src/generated/graphql";

interface GmailProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_CONTACTS = graphql(/* GraphQL */ `
  query GooglePeopleContacts($userModuleId: ID!, $take: Int!, $query: String!) {
    googlePeopleContacts(
      userModuleId: $userModuleId
      take: $take
      query: $query
    ) {
      meta {
        totalCount
      }
      elements {
        email
      }
    }
  }
`);

const Gmail = (props: GmailProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<CreateGmailEmailMutationVariables>();
  const { data, loading, refetch } = useQuery(QUERY_CONTACTS, {
    variables: {
      userModuleId,
      query: "",
      take: 10,
    },
  });
  const contacts = useMemo(() => {
    return data?.googlePeopleContacts.elements?.map((o) => o.email) || [];
  }, [data?.googlePeopleContacts.elements]);
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Message in Gmail
      </Typography>
      <TextField
        label="Subject"
        required
        inputProps={{
          maxLength: 500,
        }}
        {...register("element.subject", {
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
        {...register("element.message")}
      />
      <Controller
        render={({ field }) => (
          <FormControlLabel
            style={{
              marginLeft: -10,
            }}
            control={<Checkbox {...field} />}
            componentsProps={{
              typography: {
                sx: {
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                },
              },
            }}
            label={
              <>
                Create as draft
                <Tooltip
                  title="Only create a draft, no email will be sent"
                  placeholder="top"
                >
                  <InfoOutlined fontSize="small" />
                </Tooltip>
              </>
            }
          />
        )}
        name="isDraft"
        control={control}
        defaultValue={false}
      />
      <Typography color="text.secondary">Recipients :</Typography>
      <Controller
        render={({ field: { onChange, value, onBlur, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            loading={loading}
            onChange={(e, data) => {
              onChange(data);
            }}
            onInputChange={(e, value) =>
              refetch({
                query: value,
              })
            }
            value={value}
            {...rest}
            options={contacts}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="To"
                required
                inputProps={{
                  ...params.inputProps,
                  maxLength: 60,
                  required: !value?.length,
                }}
              />
            )}
          />
        )}
        name="element.recipients"
        control={control}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            loading={loading}
            onChange={(e, data) => {
              onChange(data);
            }}
            onInputChange={(e, value) =>
              refetch({
                query: value,
              })
            }
            value={value || undefined}
            {...rest}
            options={contacts}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Cc"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 60,
                }}
              />
            )}
          />
        )}
        name="element.cc"
        control={control}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            loading={loading}
            onChange={(e, data) => {
              onChange(data);
            }}
            onInputChange={(e, value) =>
              refetch({
                query: value,
              })
            }
            value={value || undefined}
            {...rest}
            options={contacts}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Bcc"
                inputProps={{
                  ...params.inputProps,
                  maxLength: 60,
                }}
              />
            )}
          />
        )}
        name="element.bcc"
        control={control}
      />
    </Stack>
  );
};

export default Gmail;
