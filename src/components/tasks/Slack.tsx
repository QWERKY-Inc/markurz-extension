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
import {
  CreateSlackMessageMutationVariables,
  SlackMessageReceiverTypeEnum,
} from "src/generated/graphql";

interface SlackProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_SLACK_RESOURCES = graphql(/* GraphQL */ `
  query SlackResources($userModuleId: ID!) {
    slackChannels(userModuleId: $userModuleId) {
      elements {
        id
        name
      }
    }
    slackUsers(userModuleId: $userModuleId) {
      elements {
        id
        isUser
        email
        isBot
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
  register("element.receiverType", { required: true });
  register("element.receiverId", { required: true });

  const setReceiverTypeValue = (typename: string | undefined) => {
    if (typename === "SlackChannel") {
      setValue("element.receiverType", SlackMessageReceiverTypeEnum.Channel, {
        shouldValidate: true,
      });
    } else if (typename === "SlackUser") {
      setValue("element.receiverType", SlackMessageReceiverTypeEnum.User, {
        shouldValidate: true,
      });
    }
  };

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
        {...register("element.description", { required: true })}
      />
      <Autocomplete
        filterOptions={(options, state) => {
          const inputValue = state.inputValue.toLowerCase();
          return options.filter(
            (o) =>
              o.name.toLowerCase().includes(inputValue) ||
              o.email?.toLowerCase().includes(inputValue),
          );
        }}
        onChange={(_, data) => {
          if (data) {
            setReceiverTypeValue(data.__typename);
            setValue("element.receiverId", data.id);
          }
        }}
        openOnFocus
        disableClearable
        loading={loading}
        getOptionLabel={(o) =>
          `${o.name} ${
            o.__typename === "SlackUser" && o.email ? `(${o.email})` : ""
          }` || "Untitled"
        }
        groupBy={(o) => o.group || "Untitled"}
        options={
          data
            ? [
                ...(data?.slackChannels.elements?.map((elem) => {
                  return {
                    ...elem,
                    email: undefined,
                    isUser: undefined,
                    group: "Channels",
                  };
                }) ?? []),
                ...(data.slackUsers.elements
                  ?.filter((elem) => !elem.isBot)
                  .map((elem) => {
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
