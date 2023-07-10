import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { CreateGmailEmailMutationVariables } from "src/generated/graphql";

interface GmailProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const Gmail = (props: GmailProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<CreateGmailEmailMutationVariables>();
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
            label="Create draft"
          />
        )}
        name="isDraft"
        control={control}
      />
      <Typography color="text.secondary">Recipients :</Typography>
      <Controller
        render={({ field: { onChange, value, onBlur, ...rest } }) => (
          <Autocomplete
            freeSolo
            multiple
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value}
            {...rest}
            options={[]}
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
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || undefined}
            {...rest}
            options={[]}
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
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || undefined}
            {...rest}
            options={[]}
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
