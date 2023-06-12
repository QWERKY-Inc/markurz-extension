import { useLazyQuery, useQuery } from "@apollo/client";
import { InfoOutlined } from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Checkbox,
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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
        name
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
  }, [selectedWorkspace]);

  useEffect(() => {
    if (selectedBoard) {
      fetchTrelloLabels({
        variables: {
          userModuleId,
          trelloBoardId: selectedBoard,
        },
      });
    }
  }, [selectedBoard]);

  return (
    <Stack spacing={3} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Card in Trello
      </Typography>
      <TextField
        label="Title"
        required
        size="small"
        {...register("element.name", {
          required: true,
          value: highlightedText,
        })}
      />
      <TextField
        label="Description"
        multiline
        size="small"
        {...register("element.description")}
      />
      <TextField
        select
        size="small"
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
        size="small"
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
            size="small"
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
          <Autocomplete
            freeSolo
            multiple
            onChange={(e, data) => {
              onChange(data);
            }}
            value={value || undefined}
            {...rest}
            options={
              trelloLabels?.trelloLabels.elements?.map(
                (element) => element.name
              ) ?? []
            }
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label="Select Labels"
              />
            )}
          />
        )}
        name="element.labelIds"
        control={control}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            label="Start date"
            {...field}
          />
        )}
        name="element.start"
        control={control}
      />
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                size: "small",
              },
            }}
            label="Due date"
            {...field}
          />
        )}
        name="element.due"
        control={control}
      />
    </Stack>
  );
};

export default Trello;
