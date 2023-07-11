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
import React, { useMemo, useState } from "react";
import {
  Controller,
  ControllerProps,
  FieldError,
  useFormContext,
} from "react-hook-form";
import { graphql } from "src/generated";
import { CreateGmailEmailMutationVariables } from "src/generated/graphql";
import { resolveObjectPath } from "src/lib/object";

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

const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const EmailField = (
  props: Omit<
    ControllerProps<CreateGmailEmailMutationVariables>,
    "render" | "control"
  > & {
    loading: boolean;
    contacts: Array<string>;
    refetch: <T extends Partial<object>>(args: T) => void;
    label: string;
    required?: boolean;
  }
) => {
  const {
    control,
    formState: { errors },
    setError,
  } = useFormContext<CreateGmailEmailMutationVariables>();
  const { loading, contacts, refetch, label, required, ...controllerProps } =
    props;
  const [inputValue, setInputValue] = useState("");
  const errObjPath = resolveObjectPath<FieldError>(
    controllerProps.name,
    errors
  );

  return (
    <Controller
      render={({ field: { onChange, value, onBlur, ...rest } }) => {
        const val: string[] | undefined = value as string[];
        return (
          <Autocomplete
            onBlur={() => {
              if (inputValue) {
                if (emailReg.test(inputValue)) {
                  if (!val?.length || !val.includes(inputValue)) {
                    onChange([...(val || []), inputValue]);
                    setInputValue("");
                  }
                } else {
                  setError(controllerProps.name, {
                    type: "manual",
                    message: "Invalid email",
                  });
                }
              }
            }}
            freeSolo
            multiple
            openOnFocus
            loading={loading}
            onChange={(e, data) => {
              const newValue = data.length ? data[data.length - 1] : "";
              // If there is no item at all or if the item is a proper email, proceed to add it
              if (emailReg.test(newValue) || data?.length <= 0) {
                onChange(data);
                // Otherwise trigger a form error and set the input field back to its last value
              } else {
                setError(controllerProps.name, {
                  type: "manual",
                  message: "Invalid email",
                });
                setInputValue(newValue);
              }
            }}
            onInputChange={(e, value) => {
              if (value) {
                refetch({
                  query: value,
                });
              }
              setInputValue(value);
            }}
            inputValue={inputValue}
            value={(value as string[]) || undefined}
            {...rest}
            options={contacts}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label={label}
                type="email"
                required={required}
                helperText={errObjPath?.message}
                error={!!errObjPath}
                inputProps={{
                  ...params.inputProps,
                  maxLength: 500,
                  required: required && !(value as string[])?.length,
                }}
              />
            )}
          />
        );
      }}
      control={control}
      defaultValue={[]}
      {...controllerProps}
    />
  );
};

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
      <Controller
        render={({ field }) => (
          <TextField
            label="Subject"
            required
            inputProps={{
              maxLength: 500,
            }}
            {...field}
          />
        )}
        name="element.subject"
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
      <EmailField
        name="element.recipients"
        loading={loading}
        contacts={contacts}
        refetch={refetch}
        label="To"
        required
      />
      <EmailField
        name="element.cc"
        loading={loading}
        contacts={contacts}
        refetch={refetch}
        label="Cc"
      />
      <EmailField
        name="element.bcc"
        loading={loading}
        contacts={contacts}
        refetch={refetch}
        label="Bcc"
      />
    </Stack>
  );
};

export default Gmail;
