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
import { getFragmentData, graphql } from "src/generated";
import {
  FragmentFolderFieldsFragment,
  FragmentFolderFieldsFragmentDoc,
  FragmentPaginatedBoardsFieldsFragmentDoc,
  MutationCreateMondayItemArgs,
} from "src/generated/graphql";

interface Group {
  id: string | null;
  name: string | null;
  board?: Board;
}

interface PaginatedGroups {
  elements?: Group[] | null;
}

interface Board {
  id: string;
  name: string;
}

interface PaginatedBoards {
  elements?: (Board & { groups: PaginatedGroups })[] | null;
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
  const { userModuleId, highlightedText } = props;
  const { register, setValue, control, resetField } =
    useFormContext<MutationCreateMondayItemArgs>();
  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
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
  register("element.boardId", { required: true });
  register("element.groupId", { required: true });

  useEffect(() => {
    if (selectedWorkspace) {
      setSelectedGroup(null);
      resetField("element.boardId");
      resetField("element.groupId");
      fetchMondayResources({
        variables: { userModuleId, workspaceId: selectedWorkspace },
      });
    }
  }, [selectedWorkspace, fetchMondayResources, userModuleId, resetField]);

  const generateGroupTree = (groups: PaginatedGroups, board: Board) => {
    return groups.elements?.map((group) => (
      <StyledTreeItem
        key={`${board.id}-${group.id}`}
        nodeId={`${board.id}-${group.id}`}
        labelText={group.name || "No group name"}
        labelIcon={FormatListBulletedOutlined}
        onClick={() => {
          setValue("element.boardId", board.id, { shouldValidate: true });
          if (group.id)
            setValue("element.groupId", group.id, { shouldValidate: true });
          setSelectedGroup({ ...group, board });
          setOpenAutocomplete(false);
        }}
      />
    ));
  };

  const generateBoardTree = (boards: PaginatedBoards | undefined | null) => {
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
          {generateFolderTree(folder.folders)}
          {generateBoardTree(paginatedBoards)}
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
    <Stack spacing={2} {...props}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create an item in Monday.com
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
            value={selectedGroup ?? { id: null, name: null }}
            getOptionLabel={(o) =>
              o?.name ? `${o.board?.name} > ${o.name}` : ""
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
