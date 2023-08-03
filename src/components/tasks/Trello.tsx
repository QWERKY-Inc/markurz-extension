import { useLazyQuery, useQuery } from "@apollo/client";
import {
  CheckBox,
  CheckBoxOutlineBlank,
  Circle,
  Close,
  InfoOutlined,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Checkbox,
  Chip,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
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

const QUERY_TRELLO_MEMBERS = graphql(/* GraphQL */ `
  query TrelloMembers($userModuleId: ID!, $trelloBoardId: ID!) {
    trelloMembers(userModuleId: $userModuleId, trelloBoardId: $trelloBoardId) {
      elements {
        id
        fullName
      }
    }
  }
`);

const Trello = (props: TrelloProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, control, resetField } =
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
  const [fetchTrelloMembers, { data: trelloMembers }] =
    useLazyQuery(QUERY_TRELLO_MEMBERS);
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
      // If the selected board changes we need to reset the labels since they belong to a specific board
      resetField("element.labelIds");
      fetchTrelloLabels({
        variables: {
          userModuleId,
          trelloBoardId: selectedBoard,
        },
      });
      fetchTrelloMembers({
        variables: {
          userModuleId,
          trelloBoardId: selectedBoard,
        },
      });
    }
  }, [
    selectedBoard,
    fetchTrelloLabels,
    fetchTrelloMembers,
    userModuleId,
    resetField,
  ]);

  const getElementLabel = (value: any) => {
    const elem = trelloLabels?.trelloLabels.elements?.find(
      (o) => o.id === value,
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
        name="element.name"
        control={control}
        rules={{ required: true }}
        defaultValue={highlightedText}
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
        ))}
        {!data?.trelloWorkspaces.elements?.length && (
          <MenuItem disabled>
            There are no workspaces available to select. Please create a
            workspace in Trello.
          </MenuItem>
        )}
      </TextField>
      <TextField
        select
        label="Select Board"
        required
        onChange={(e) => setSelectedBoard(e.target.value)}
        disabled={!selectedWorkspace}
      >
        {trelloBoards?.trelloBoards.elements?.map((board) => (
          <MenuItem key={board.id} value={board.id}>
            {board.name}
          </MenuItem>
        ))}
        {!trelloBoards?.trelloBoards.elements?.length && (
          <MenuItem disabled>
            There are no boards available to select. Please create a board in
            Trello.
          </MenuItem>
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
              ))}
            {!trelloBoards?.trelloBoards.elements?.find(
              (o) => o.id === selectedBoard,
            )?.lists?.length && (
              <MenuItem disabled>
                There are no lists available to select. Please create a list in
                Trello.
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
            disabled={!selectedBoard}
            InputProps={{
              endAdornment: value?.length ? (
                <InputAdornment position="start">
                  <IconButton
                    size="small"
                    aria-label="clear field"
                    onClick={() => onChange([])}
                    edge="start"
                    disabled={!selectedBoard}
                    sx={{ marginRight: 1 }}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
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
            {!trelloLabels?.trelloLabels.elements?.length && (
              <MenuItem disabled>
                There are no labels available to select. Please create labels in
                Trello.
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.labelIds"
        control={control}
      />
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
      <Controller
        render={({ field: { onChange, value, ...rest } }) => (
          <Autocomplete
            {...rest}
            multiple
            disableCloseOnSelect
            disabled={!selectedBoard}
            onChange={(_, newValue) =>
              onChange(newValue.map((value) => value.id))
            }
            options={trelloMembers?.trelloMembers.elements ?? []}
            value={
              trelloMembers?.trelloMembers.elements?.filter(
                (member) => value && value.indexOf(member.id) !== -1,
              ) ?? []
            }
            getOptionLabel={(option) => option.fullName}
            renderInput={(params) => (
              <TextField {...params} label="Select Members" />
            )}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={<CheckBoxOutlineBlank />}
                  checkedIcon={<CheckBox />}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.fullName}
              </li>
            )}
          />
        )}
        name="element.memberIds"
        control={control}
      />
      <Controller
        render={({ field }) => (
          <DateTimePicker
            slotProps={{
              textField: {
                size: "small",
              },
              actionBar: {
                actions: ["clear", "accept"],
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
              actionBar: {
                actions: ["clear", "accept"],
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
