import { useLazyQuery, useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Chip,
  ListItemText,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { CreateTrelloCardMutationVariables } from "src/generated/graphql";

interface TrelloProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

const QUERY_TRELLO_WORKSPACES = graphql(/* GraphQL */ `
  query TrelloWorkspaces($userModuleId: ID!) {
    trelloWorkspaces(userModuleId: $userModuleId) {
      elements {
        id
        displayName
      }
      meta {
        totalCount
      }
    }
  }
`);

const QUERY_TRELLO_BOARDS = graphql(/* GraphQL */ `
  query TrelloBoards($userModuleId: ID!, $workspaceId: ID!) {
    trelloBoards(userModuleId: $userModuleId, workspaceId: $workspaceId) {
      meta {
        totalCount
      }
      elements {
        id
        name
        lists {
          id
          name
        }
      }
    }
  }
`);

const QUERY_TRELLO_LABELS = graphql(/* GraphQL */ `
  query TrelloLabels($userModuleId: ID!, $trelloBoardId: ID!) {
    trelloLabels(userModuleId: $userModuleId, trelloBoardId: $trelloBoardId) {
      meta {
        totalCount
      }
      elements {
        id
        label: name
      }
    }
  }
`);

const Trello = (props: TrelloProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control } =
    useFormContext<CreateTrelloCardMutationVariables>();
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const { data } = useQuery(QUERY_TRELLO_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  const [fetchTrelloBoards, { data: trelloBoards }] =
    useLazyQuery(QUERY_TRELLO_BOARDS);
  const [fetchTrelloLabels, { data: trelloLabels }] =
    useLazyQuery(QUERY_TRELLO_LABELS);
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (selectedWorkspace) {
      fetchTrelloBoards({
        variables: {
          userModuleId,
          workspaceId: selectedWorkspace,
        },
      });
    }
  }, [selectedWorkspace, userModuleId, fetchTrelloBoards]);

  useEffect(() => {
    if (selectedBoard) {
      fetchTrelloLabels({
        variables: {
          userModuleId,
          trelloBoardId: selectedBoard,
        },
      });
    }
  }, [selectedBoard, fetchTrelloLabels, userModuleId]);

  return (
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Card in Trello
      </Typography>
      <TextField
        label="Title"
        required
        {...register("element.name", {
          required: true,
          value: highlightedText,
        })}
      />
      <TextField
        label="Description"
        multiline
        {...register("element.description")}
      />
      <TextField
        select
        label="Select Workspace"
        required
        onChange={(e) => setSelectedWorkspace(e.target.value)}
      >
        {data?.trelloWorkspaces.elements?.map((trelloWorkspaces) => (
          <MenuItem key={trelloWorkspaces.id} value={trelloWorkspaces.id}>
            {trelloWorkspaces.displayName}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Select Board"
        onChange={(e) => setSelectedBoard(e.target.value)}
      >
        {trelloBoards?.trelloBoards.elements?.map((board) => (
          <MenuItem key={board.id} value={board.id}>
            {board.name}
          </MenuItem>
        ))}
      </TextField>
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            {...rest}
            value={value}
            select
            label="Select List"
            required
            onChange={(e) => onChange(e.target.value)}
          >
            {trelloBoards?.trelloBoards.elements
              ?.find((o) => o.id === selectedBoard)
              ?.lists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name}
                </MenuItem>
              ))}
          </TextField>
        )}
        name="element.listId"
        control={control}
      />
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            select
            onChange={onChange}
            value={value || []}
            {...rest}
            label="Select Labels"
            SelectProps={{
              renderValue: (selected: any) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value: any) => (
                    <Chip
                      key={value}
                      label={
                        trelloLabels?.trelloLabels.elements?.find(
                          (o) => o.id === value
                        )?.label
                      }
                    />
                  ))}
                </Box>
              ),
              multiple: true,
            }}
          >
            {trelloLabels?.trelloLabels.elements?.map((trelloLabel) => (
              <MenuItem key={trelloLabel.id} value={trelloLabel.id}>
                <Checkbox
                  checked={Boolean(value && value.indexOf(trelloLabel.id) > -1)}
                />
                <ListItemText primary={trelloLabel.label} />
              </MenuItem>
            ))}
          </TextField>
        )}
        name="element.labelIds"
        control={control}
      />
      <Typography color="text.secondary">
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => <DateTimePicker label="Start date" {...field} />}
        name="element.start"
        control={control}
      />
      <Controller
        render={({ field }) => <DateTimePicker label="Due date" {...field} />}
        name="element.due"
        control={control}
      />
    </Stack>
  );
};

export default Trello;
