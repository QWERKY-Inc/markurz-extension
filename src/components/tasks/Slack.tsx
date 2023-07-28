import { useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { CreateSlackMessageMutationVariables } from "src/generated/graphql";

interface SlackProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_SLACK_RESOURCES = graphql(/* GraphQL */ `
  query SlackResources($userModuleId: ID!) {
    slackChannels(userModuleId: $userModuleId) {
      elements {
        id
        isMember
        name
      }
    }
    slackUsers(userModuleId: $userModuleId) {
      elements {
        id
        name
      }
    }
  }
`);

const Slack = (props: SlackProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, setValue, control } =
    useFormContext<CreateSlackMessageMutationVariables>();
  const { data, loading } = useQuery(QUERY_SLACK_RESOURCES, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });

  return (
    <Stack spacing={2} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Message in Slack
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
        label="Message"
        required
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.description")}
      />

      <Autocomplete
        onChange={(_, data) => {
          if (data) {
            setValue("element.channelIdOrUserId", data.id);
          }
        }}
        openOnFocus
        loading={loading}
        getOptionLabel={(o) => o.name || "Untitled"}
        groupBy={(o) => o.group || "Untitled"}
        options={
          data
            ? [
                ...(data?.slackChannels.elements?.map((elem) => {
                  return { ...elem, group: "Channels" };
                }) ?? []),
                ...(data.slackUsers.elements?.map((elem) => {
                  return { ...elem, group: "Direct messages" };
                }) ?? []),
              ]
            : []
        }
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="To"
            placeholder="Search channels or direct messages"
            required
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
    </Stack>
  );
};

export default Slack;
