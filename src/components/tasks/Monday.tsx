import { useLazyQuery, useQuery } from "@apollo/client";
import {
  ChevronRight,
  ExpandMore,
  FolderOpenOutlined,
  FormatListBulletedOutlined,
  InfoOutlined,
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
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { StyledTreeItem } from "src/components/formComponents/styledTreeItem";
import { graphql } from "src/generated";
import {
  MondayFolderColorEnum,
  MutationCreateMondayItemArgs,
} from "src/generated/graphql";

interface Group {
  id: string;
  name: string;
  board?: Board;
}

interface PaginatedGroups {
  elements?: Group[] | null | undefined;
}

interface Board {
  id: string;
  name: string;
}

interface PaginatedBoards {
  elements?: (Board & { groups: PaginatedGroups })[] | null | undefined;
}

interface PaginatedFolders {
  elements?:
    | {
        id: string;
        name: string;
        color?: MondayFolderColorEnum | null | undefined;
        boards: PaginatedBoards;
        folders?: PaginatedFolders;
      }[]
    | null
    | undefined;
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

const QUERY_MONDAY_RESOURCES = graphql(/* GraphQL */ `
  query MondayResources($userModuleId: ID!, $workspaceId: ID!) {
    mondayResources(userModuleId: $userModuleId, workspaceId: $workspaceId) {
      boards {
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
      folders {
        elements {
          id
          name
          color
          boards {
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
          folders {
            elements {
              id
              name
              color
              boards {
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
            }
          }
        }
      }
    }
  }
`);

const Monday = (props: MondayProps) => {
  const { userModuleId, highlightedText } = props;
  const { register, setValue, control } =
    useFormContext<MutationCreateMondayItemArgs>();

  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group>({
    id: "",
    name: "",
  });
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

  useEffect(() => {
    if (selectedWorkspace) {
      setSelectedGroup({ id: "", name: "" });
      fetchMondayResources({
        variables: { userModuleId, workspaceId: selectedWorkspace },
      });
    }
  }, [selectedWorkspace, fetchMondayResources, userModuleId]);

  const generateGroupTree = (groups: PaginatedGroups, board: Board) => {
    return groups.elements?.map((group) => (
      <StyledTreeItem
        key={`${board.id}-${group.id}`}
        nodeId={`${board.id}-${group.id}`}
        labelText={group.name}
        labelIcon={FormatListBulletedOutlined}
        onClick={() => {
          setValue("element.boardId", board.id);
          setValue("element.groupId", group.id);
          setSelectedGroup({ ...group, board });
          setOpenAutocomplete(false);
        }}
      />
    ));
  };

  const generateBoardTree = (boards: PaginatedBoards | undefined) => {
    return boards?.elements?.length ? (
      boards?.elements?.map((board) => (
        <StyledTreeItem
          key={board.id}
          nodeId={board.id}
          labelText={board.name}
          labelIcon={SpaceDashboardOutlined}
        >
          {generateGroupTree(board.groups, board)}
        </StyledTreeItem>
      ))
    ) : (
      <TreeItem
        nodeId="disabled"
        disabled
        label="There are no boards and groups available to select. Please add a board in this folder."
      />
    );
  };

  const generateFolderTree = (folders: PaginatedFolders | undefined) => {
    return folders?.elements?.map((folder) => (
      <StyledTreeItem
        key={folder.id}
        nodeId={folder.id}
        labelText={folder.name}
        labelIcon={FolderOpenOutlined}
      >
        {generateFolderTree(folder.folders)}
        {generateBoardTree(folder.boards)}
      </StyledTreeItem>
    ));
  };

  const generateTreeView = () => {
    if (mondayResourcesLoading) {
      return <Typography sx={{ paddingLeft: 1 }}>Loading...</Typography>;
    }
    if (
      !mondayResourcesData?.mondayResources.folders.elements?.length &&
      !mondayResourcesData?.mondayResources.boards.elements?.length
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
        {generateBoardTree(mondayResourcesData?.mondayResources.boards)}
      </TreeView>
    );
  };

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
      <TextField
        select
        label="Select Workspace"
        required
        value={selectedWorkspace}
        onChange={(e) => {
          setSelectedWorkspace(e.target.value);
        }}
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
      <ClickAwayListener onClickAway={() => setOpenAutocomplete(false)}>
        <Box>
          <Autocomplete
            options={[]}
            renderInput={(params) => (
              <TextField {...params} label="Select Board > Group" required />
            )}
            open={openAutocomplete}
            onOpen={() => setOpenAutocomplete(true)}
            value={selectedGroup}
            getOptionLabel={(o) =>
              o.name.length ? `${o.board?.name} > ${o.name}` : ""
            }
            disabled={!selectedWorkspace}
            openOnFocus
            disableClearable
            disableCloseOnSelect
            PaperComponent={() => (
              <Paper sx={{ px: 1, py: 2 }}>{generateTreeView()}</Paper>
            )}
          />
        </Box>
      </ClickAwayListener>
    </Stack>
  );
};

export default Monday;
