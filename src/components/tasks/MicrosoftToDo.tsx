import { InfoOutlined } from "@mui/icons-material";
import { Stack, StackProps, TextField, Typography } from "@mui/material";
import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { MutationCreateMicrosoftTodoTaskArgs } from "src/generated/graphql";

interface MicrosoftToDoProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const MicrosoftToDo = (props: MicrosoftToDoProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<MutationCreateMicrosoftTodoTaskArgs>();
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={3} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an issue in MicrosoftToDo
      </Typography>
      <Controller
        render={({ field }) => (
          <TextField
            label="Summary"
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
    </Stack>
  );
};

export default MicrosoftToDo;
