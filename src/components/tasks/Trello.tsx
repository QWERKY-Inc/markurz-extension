import { useLazyQuery, useQuery } from "@apollo/client";
import { Circle, InfoOutlined } from "@mui/icons-material";
import {
  Box,
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
        color
      }
    }
  }
`);

const Trello = (props: TrelloProps) => {
  const { userModuleId } = props;
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
  }, [selectedWorkspace, fetchTrelloBoards, userModuleId]);

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

  const getElementLabel = (value: any) => {
    const elem = trelloLabels?.trelloLabels.elements?.find(
      (o) => o.id === value
    );
    if (!elem) return null;
    return (
      <>
        {!!elem.color && (
          <Circle
            sx={{
              color: elem.color ?? "transparent",
            }}
          />
        )}{" "}
        {elem.label}
      </>
    );
  };

  return (
    <Stack spacing={3} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Card in Trello
      </Typography>
      <TextField
        label="Title"
        required
        {...register("element.name", {
          required: true,
        })}
        inputProps={{
          maxLength: 500,
        }}
      />
      <TextField
        label="Description"
        multiline
        {...register("element.description")}
        maxRows={10}
        inputProps={{
          maxLength: 2000,
        }}
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
        )) ?? (
          <MenuItem disabled>
            There are no workspace available to select
          </MenuItem>
        )}
      </TextField>
      <TextField
        select
        label="Select Board"
        required
        disabled={!trelloBoards?.trelloBoards.elements?.length}
        onChange={(e) => setSelectedBoard(e.target.value)}
      >
        {trelloBoards?.trelloBoards.elements?.map((board) => (
          <MenuItem key={board.id} value={board.id}>
            {board.name}
          </MenuItem>
        )) ?? (
          <MenuItem disabled>There are no boards available to select</MenuItem>
        )}
      </TextField>
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <TextField
            {...rest}
            value={value}
            select
            label="Select List"
            required
            disabled={!selectedBoard}
            onChange={(e) => onChange(e.target.value)}
          >
            {trelloBoards?.trelloBoards.elements
              ?.find((o) => o.id === selectedBoard)
              ?.lists.map((list) => (
                <MenuItem key={list.id} value={list.id}>
                  {list.name}
                </MenuItem>
              )) ?? (
              <MenuItem disabled>
                There are no list available to select
              </MenuItem>
            )}
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
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 0.5,
                    "& .MuiChip-label": {
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    },
                  }}
                >
                  {selected.map((value: any) => (
                    <Chip key={value} label={<>{getElementLabel(value)}</>} />
                  ))}
                </Box>
              ),
              multiple: true,
            }}
          >
            {trelloLabels?.trelloLabels.elements?.map((trelloLabel) => (
              <MenuItem key={trelloLabel.id} value={trelloLabel.id}>
                <Circle
                  sx={{
                    color: trelloLabel.color ?? "transparent",
                    mr: 1,
                  }}
                />
                <ListItemText primary={trelloLabel.label} />
              </MenuItem>
            ))}
          </TextField>
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
