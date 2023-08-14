import { useLazyQuery, useQuery } from "@apollo/client";
import {
  ChevronRight,
  ExpandMore,
  FolderOpenOutlined,
  FormatListBulletedOutlined,
  SpaceDashboardOutlined,
} from "@mui/icons-material";
import { TreeItem, TreeView } from "@mui/lab";
import {
  Autocomplete,
  Box,
  ClickAwayListener,
  MenuItem,
  Paper,
  Stack,
  StackProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyledTreeItem } from "src/components/formComponents/StyledTreeItem";
import TaskTitle from "src/components/formComponents/TaskTitle";
import { getFragmentData, graphql } from "src/generated";
import {
  FragmentFolderFieldsFragment,
  FragmentFolderFieldsFragmentDoc,
  FragmentPaginatedBoardsFieldsFragment,
  FragmentPaginatedBoardsFieldsFragmentDoc,
  MutationCreateMondayItemArgs,
} from "src/generated/graphql";

interface Group {
  id: string | null;
  name: string | null;
  board?: Board | null;
}

interface PaginatedGroups {
  elements?: Group[] | null;
}

interface Board {
  id: string;
  name: string;
}

interface PaginatedFolders {
  elements?:
    | ({
        folders?: PaginatedFolders;
      } & {
        " $fragmentRefs"?: {
          FragmentFolderFieldsFragment: FragmentFolderFieldsFragment;
        };
      })[]
    | null;
}

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

export const FRAGMENT_PAGINATED_BOARD_FIELDS = graphql(/* GraphQL */ `
  fragment FragmentPaginatedBoardsFields on PaginatedMondayBoards {
    elements {
      id
      name
      groups {
        elements {
          id
          name
        }
      }
    }
  }
`);

export const FRAGMENT_FOLDER_FIELDS = graphql(/* GraphQL */ `
  fragment FragmentFolderFields on MondayFolder {
    id
    name
    boards {
      ...FragmentPaginatedBoardsFields
    }
  }
`);

const QUERY_MONDAY_RESOURCES = graphql(/* GraphQL */ `
  query MondayResources($userModuleId: ID!, $workspaceId: ID!) {
    mondayResources(userModuleId: $userModuleId, workspaceId: $workspaceId) {
      boards {
        ...FragmentPaginatedBoardsFields
      }
      folders {
        elements {
          ...FragmentFolderFields
          folders {
            elements {
              ...FragmentFolderFields
            }
          }
        }
      }
    }
  }
`);

const Monday = (props: MondayProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { register, setValue, control, resetField, watch } = useFormContext<
    MutationCreateMondayItemArgs & {
      element: { workspace: string; group: Group | null };
    }
  >();
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const { data: mondayWorkspacesData } = useQuery(QUERY_MONDAY_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  const [
    fetchMondayResources,
    { data: mondayResourcesData, loading: mondayResourcesLoading },
  ] = useLazyQuery(QUERY_MONDAY_RESOURCES);
  register("userModuleId", { value: userModuleId });
  register("element.workspace", { required: true });
  register("element.group", { required: true });
  const selectedWorkspace = watch("element.workspace");

  useEffect(() => {
    if (selectedWorkspace) {
      resetField("element.group");
      fetchMondayResources({
        variables: { userModuleId, workspaceId: selectedWorkspace },
      });
    }
  }, [selectedWorkspace, fetchMondayResources, userModuleId, resetField]);

  useEffect(() => {
    if (highlightedText) {
      resetField("element.title", { defaultValue: highlightedText });
    }
  }, [resetField, highlightedText]);

  const generateGroupTree = (
    groups: PaginatedGroups | null | undefined,
    board: Board,
  ) => {
    return groups?.elements?.map((group) => (
      <StyledTreeItem
        key={`${board.id}-${group.id}`}
        nodeId={`${board.id}-${group.id}`}
        labelText={group.name || "No group name"}
        labelIcon={FormatListBulletedOutlined}
        onClick={() => {
          setValue(
            "element.group",
            { ...group, board },
            { shouldValidate: true },
          );
          setOpenAutocomplete(false);
        }}
      />
    ));
  };

  const generateBoardTree = (
    boards: FragmentPaginatedBoardsFieldsFragment | undefined | null,
  ) => {
    return boards?.elements?.map((board) => (
      <StyledTreeItem
        key={board.id}
        nodeId={board.id}
        labelText={board.name}
        labelIcon={SpaceDashboardOutlined}
      >
        {generateGroupTree(board.groups, board)}
      </StyledTreeItem>
    ));
  };

  const generateFolderTree = (folders: PaginatedFolders | undefined) =>
    folders?.elements?.map((folder) => {
      const folderFragment = getFragmentData(
        FragmentFolderFieldsFragmentDoc,
        folder,
      );
      const paginatedBoards = getFragmentData(
        FragmentPaginatedBoardsFieldsFragmentDoc,
        folderFragment.boards,
      );
      return (
        <StyledTreeItem
          key={folderFragment.id}
          nodeId={folderFragment.id}
          labelText={folderFragment.name}
          labelIcon={FolderOpenOutlined}
        >
          {!paginatedBoards?.elements?.length &&
          !folder.folders?.elements?.length ? (
            <TreeItem
              nodeId="disabled"
              disabled
              label="There are no boards and groups available to select. Please add a board in this folder."
            />
          ) : (
            <span>
              {generateFolderTree(folder.folders)}
              {generateBoardTree(paginatedBoards)}
            </span>
          )}
        </StyledTreeItem>
      );
    });

  const generateTreeView = () => {
    if (mondayResourcesLoading) {
      return <Typography sx={{ paddingLeft: 1 }}>Loading...</Typography>;
    }
    const paginatedBoards = getFragmentData(
      FragmentPaginatedBoardsFieldsFragmentDoc,
      mondayResourcesData?.mondayResources.boards,
    );
    if (
      !mondayResourcesData?.mondayResources.folders.elements?.length &&
      !paginatedBoards?.elements?.length
    ) {
      return (
        <Typography color="text.disabled" sx={{ paddingLeft: "16px" }}>
          There are no boards and groups available to select. Please add a board
          in this workspace.
        </Typography>
      );
    }
    return (
      <TreeView
        defaultCollapseIcon={<ExpandMore />}
        defaultExpandIcon={<ChevronRight />}
        sx={{ width: "calc(100% - 16px)" }}
      >
        {generateFolderTree(mondayResourcesData?.mondayResources.folders)}
        {generateBoardTree(paginatedBoards)}
      </TreeView>
    );
  };

  return (
    <Stack spacing={2} {...stackProps}>
      <TaskTitle content="Create an item in Monday.com" />
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
      <Controller
        render={({ field: { onChange, ...rest } }) => (
          <TextField
            select
            label="Select Workspace"
            required
            onChange={(e) => {
              resetField("element.group", { defaultValue: null });
              onChange(e.target.value);
            }}
            {...rest}
          >
            {mondayWorkspacesData?.mondayWorkspaces.elements?.map(
              (mondayWorkspaceElement) => (
                <MenuItem
                  key={mondayWorkspaceElement.id}
                  value={mondayWorkspaceElement.id}
                >
                  {mondayWorkspaceElement.name}
                </MenuItem>
              ),
            ) ?? (
              <MenuItem disabled>
                There are no workspace available to select
              </MenuItem>
            )}
          </TextField>
        )}
        name="element.workspace"
        control={control}
        defaultValue=""
      />
      <ClickAwayListener onClickAway={() => setOpenAutocomplete(false)}>
        <Box>
          <Controller
            render={({ field: { onChange, value, ...rest } }) => (
              <Autocomplete
                options={[]}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Board > Group"
                    required
                  />
                )}
                open={openAutocomplete}
                onOpen={() => setOpenAutocomplete(true)}
                {...rest}
                value={value || { id: null, name: null }}
                onChange={(e, value) => onChange(value)}
                getOptionLabel={(o) =>
                  o?.name ? `${o.board?.name} > ${o.name}` : ""
                }
                disabled={!selectedWorkspace}
                openOnFocus
                disableClearable
                disableCloseOnSelect
                PaperComponent={() => (
                  <Paper
                    sx={{ px: 1, py: 2, maxHeight: 200, overflow: "auto" }}
                  >
                    {generateTreeView()}
                  </Paper>
                )}
              />
            )}
            name="element.group"
            control={control}
            defaultValue={null}
          />
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};

export default Monday;
