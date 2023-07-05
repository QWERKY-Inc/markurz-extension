import { Stack, StackProps } from "@mui/material";
import React from "react";
import { useFormContext } from "react-hook-form";
import { MutationCreateEvernoteNoteArgs } from "src/generated/graphql";

interface EvernoteProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const Evernote = (props: EvernoteProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control } =
    useFormContext<MutationCreateEvernoteNoteArgs>();

  return (
    <Stack spacing={2} {...stackProps}>
      evernote
    </Stack>
  );
};

export default Evernote;
