import { useQuery } from '@apollo/client';
import { InfoOutlined } from '@mui/icons-material';
import { Stack, StackProps, TextField, Typography } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { graphql } from 'src/generated';
import { MutationCreateMondayItemArgs } from 'src/generated/graphql';

interface MondayProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_MONDAY_WORKSPACES = graphql(/* GraphQL */ `
  query MondayWorkspaces($userModuleId: ID!) {
    mondayWorkspaces(userModuleId: $userModuleId) {
      elements {
        id
        name
      }
    }
  }
`);

const Monday = (props: MondayProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<MutationCreateMondayItemArgs>();
  const { data } = useQuery(QUERY_MONDAY_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a item in Monday.com
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
        label="Conversation"
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.description")}
      />
    </Stack>
  );
};

export default Monday;
