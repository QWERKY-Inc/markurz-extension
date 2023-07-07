import { useQuery } from "@apollo/client";
import {
  BookOutlined,
  ChevronRight,
  ExpandMore,
  InfoOutlined,
  ViewAgendaOutlined,
} from "@mui/icons-material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { TreeItem, TreeItemProps, TreeView } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Checkbox,
  ClickAwayListener,
  Paper,
  Stack,
  StackProps,
  SvgIconProps,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { graphql } from "src/generated";
import { MutationCreateEvernoteNoteArgs } from "src/generated/graphql";

interface EvernoteProps extends StackProps {
  userModuleId: string;
  highlightedText: string;
}

function StyledTreeItem(
  props: TreeItemProps & {
    labelIcon: React.ElementType<SvgIconProps>;
    labelText: string;
  }
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

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const QUERY_EVERNOTE_DATA = graphql(/* GraphQL */ `
  query EvernoteData($userModuleId: ID!) {
    evernoteNotebooks(userModuleId: $userModuleId) {
      meta {
        totalCount
      }
      elements {
        id
        name
        stack
      }
    }
    evernoteTags(userModuleId: $userModuleId) {
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

const Evernote = (props: EvernoteProps) => {
  const { userModuleId, highlightedText, ...stackProps } = props;
  const { data: dataNotebooks, loading } = useQuery(QUERY_EVERNOTE_DATA, {
    variables: {
      userModuleId,
    },
  });
  const { register, control, watch, setValue } =
    useFormContext<MutationCreateEvernoteNoteArgs>();
  register("userModuleId", { value: userModuleId });
  const selectedNotebookId = watch("element.notebookId");
  const selectedNotebook = dataNotebooks?.evernoteNotebooks.elements
    ? dataNotebooks.evernoteNotebooks.elements.find(
        (o) => o.id === selectedNotebookId
      )
    : null;
  const [open, setOpen] = useState(false);

  return (
    <Stack spacing={2} {...stackProps}>
      <Typography display="flex" gap={1} alignItems="center">
        <InfoOutlined fontSize="small" />
        Create a Note in Evernote
      </Typography>
      <TextField
        label="Title"
        required
        inputProps={{
          maxLength: 255,
        }}
        {...register("element.title", {
          required: true,
          value: highlightedText,
        })}
      />
      <TextField
        label="Content"
        multiline
        inputProps={{
          maxLength: 2000,
        }}
        {...register("element.content")}
      />
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Box>
          <Autocomplete
            slotProps={{
              popper: {
                sx: {
                  marginLeft: `16px !important`,
                },
              },
            }}
            renderInput={(params) => (
              <TextField {...params} label="Select Notebook" required />
            )}
            value={selectedNotebook}
            options={dataNotebooks?.evernoteNotebooks.elements || []}
            loading={loading}
            open={open}
            getOptionLabel={(o) => o.name}
            onOpen={() => {
              setOpen(true);
            }}
            openOnFocus
            autoComplete={false}
            disableCloseOnSelect
            disablePortal
            PaperComponent={() => (
              <Paper sx={{ px: 1, py: 2 }}>
                {loading && !dataNotebooks ? (
                  <Typography sx={{ paddingLeft: 1 }}>Loading...</Typography>
                ) : (
                  <TreeView
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                  >
                    {dataNotebooks?.evernoteNotebooks.elements?.map(
                      (evernoteNotebook) => (
                        <StyledTreeItem
                          labelIcon={
                            evernoteNotebook.stack
                              ? ViewAgendaOutlined
                              : BookOutlined
                          }
                          nodeId={evernoteNotebook.id}
                          labelText={evernoteNotebook.name}
                          onClick={
                            !evernoteNotebook.stack
                              ? () => {
                                  setValue(
                                    "element.notebookId",
                                    evernoteNotebook.id
                                  );
                                }
                              : undefined
                          }
                        >
                          {evernoteNotebook.stack && (
                            <StyledTreeItem
                              nodeId={`${evernoteNotebook.id}-${evernoteNotebook.stack}`}
                              labelText={evernoteNotebook.stack}
                              labelIcon={BookOutlined}
                            />
                          )}
                        </StyledTreeItem>
                      )
                    )}
                  </TreeView>
                )}
              </Paper>
            )}
          />
        </Box>
      </ClickAwayListener>
      <Typography color="text.secondary" sx={{ pt: 2 }}>
        Additional Information (optional)
      </Typography>
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
              dataNotebooks?.evernoteTags.elements?.map((o) => o.name) ?? []
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
              <TextField {...params} variant="outlined" label="Select Tags" />
            )}
          />
        )}
        name="element.tagNames"
        control={control}
      />
    </Stack>
  );
};

export default Evernote;
