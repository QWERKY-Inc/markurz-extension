import { useQuery } from "@apollo/client";
import { Autocomplete, Stack, StackProps, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import TaskTitle from "src/components/formComponents/TaskTitle";
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

type Receiver =
  | {
      email: undefined;
      isUser: undefined;
      group: string;
      __typename?: "SlackChannel" | undefined;
      id: string;
      name: string;
    }
  | {
      group: string;
      __typename?: "SlackUser" | undefined;
      id: string;
      isUser: boolean;
      email?: string | null | undefined;
      isBot: boolean;
      name: string;
    };

const Slack = (props: SlackProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, control, resetField } = useFormContext<
    CreateSlackMessageMutationVariables & {
      element: { receiver: Receiver | null };
    }
  >();
  const { data, loading } = useQuery(QUERY_SLACK_RESOURCES, {
    variables: {
      userModuleId,
    },
  });
  register("userModuleId", { value: userModuleId });
  register("element.receiver", { required: true });

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  return (
    <Stack spacing={2} {...stackProps}>
      <TaskTitle content="Create a Message in Slack" />
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
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.description")}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            {...rest}
            filterOptions={(options, state) => {
              const inputValue = state.inputValue.toLowerCase();
              return options.filter(
                (o) =>
                  o.name.toLowerCase().includes(inputValue) ||
                  o.email?.toLowerCase().includes(inputValue),
              );
            }}
            onChange={(_, data) => {
              onChange(data);
            }}
            value={value}
            openOnFocus
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
              />
            )}
          />
        )}
        name="element.receiver"
        control={control}
        defaultValue={null}
      />
    </Stack>
  );
};

export default Slack;
