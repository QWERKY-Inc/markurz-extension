import { useLazyQuery, useQuery } from "@apollo/client";
import {
  ChevronRight,
  ExpandMore,
  FolderOpenOutlined,
  FormatListBulletedOutlined,
  InfoOutlined,
  SpaceDashboardOutlined,
} from "@mui/icons-material";
import { TreeItem, TreeItemProps, TreeView } from "@mui/lab";
import {
  Autocomplete,
  Box,
  ClickAwayListener,
  MenuItem,
  Paper,
  Stack,
  StackProps,
  SvgIconProps,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MondayFolderColorEnum, MutationCreateMondayItemArgs } from "src/generated/graphql";

interface PaginatedGroups {
  elements?:
  | {
      id: string;
      name: string;
    }[]
  | null
  | undefined;
}

interface PaginatedBoards {
    elements?: ({
        id: number;
        name: string;
        groups: PaginatedGroups;
    }[] | null | undefined);
}

interface PaginatedFolders {
    elements?: {
        id?: number | null | undefined;
        name: string;
        color?: MondayFolderColorEnum | null | undefined;
        boards: PaginatedBoards;
        folders?: PaginatedFolders;
    }[] | null | undefined;
}

interface MondayProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

function StyledTreeItem(
  props: TreeItemProps & {
    labelIcon: React.ElementType<SvgIconProps>;
    labelText: string;
  },
) {
  const { labelIcon, labelText, ...other } = props;

  return (
    <TreeItem
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={labelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
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
  const { register, control } = useFormContext<MutationCreateMondayItemArgs>();

  const [selectedWorkspace, setSelectedWorkspace] = useState("");
  const [openAutocomplete, setOpenAutocomplete] = useState(false);
  const { data: mondayWorkspacesData } = useQuery(QUERY_MONDAY_WORKSPACES, {
    variables: {
      userModuleId,
    },
  });
  const [fetchMondayResources, { data: mondayResourcesData }] = useLazyQuery(
    QUERY_MONDAY_RESOURCES,
  );
  register("userModuleId", { value: userModuleId });

  useEffect(() => {
    if (selectedWorkspace) {
      fetchMondayResources({
        variables: { userModuleId, workspaceId: selectedWorkspace },
      });
    }
  }, [selectedWorkspace, fetchMondayResources, userModuleId]);

  const generateGroupTree = (groups: PaginatedGroups) => {
    return groups.elements?.map((group) => (
      <StyledTreeItem
        nodeId={group.id}
        labelText={group.name}
        labelIcon={FormatListBulletedOutlined}
      />
    ));
  };

  const generateBoardTree = (boards: PaginatedBoards | undefined) => {
    return boards?.elements?.map(
      (board) => (
        <StyledTreeItem
          nodeId={board.id.toString()}
          labelText={board.name}
          labelIcon={SpaceDashboardOutlined}
        >
          { generateGroupTree(board.groups) }
        </StyledTreeItem>
      ),
    )
  };

  const generateFolderTree = (folders: PaginatedFolders | undefined) => {
    return folders?.elements?.map(
      (folder) => (
        <StyledTreeItem
          nodeId={folder.id?.toString() || "Default"}
          labelText={folder.name}
          labelIcon={FolderOpenOutlined}
        >
          { generateFolderTree(folder.folders) }
          { generateBoardTree(folder.boards) }
        </StyledTreeItem>
      ),
    )
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
        <span>
          <Autocomplete
            options={[]}
            renderInput={(params) => (
              <TextField {...params} label="Select Group" />
            )}
            open={openAutocomplete}
            onOpen={() => setOpenAutocomplete(true)}
            openOnFocus
            disableClearable
            disableCloseOnSelect
            PaperComponent={() => (
              <Paper sx={{ px: 1, py: 2 }}>
                {
                  <TreeView
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                  >
                    { generateBoardTree(mondayResourcesData?.mondayResources.boards) }
                    { generateFolderTree(mondayResourcesData?.mondayResources.folders ) }
                  </TreeView>
                }
              </Paper>
            )}
          />
        </span>
      </ClickAwayListener>
    </Stack>
  );
};

export default Monday;
