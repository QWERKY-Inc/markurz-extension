import { DocumentNode, useQuery } from "@apollo/client";
import { Add, Close, Link } from "@mui/icons-material";
import { LoadingButton, TabContext, TabPanel } from "@mui/lab";
import {
  Box,
  Button,
  Drawer,
  DrawerProps,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-use";
import { apolloClient } from "src/apollo";
import {
  MUTATION_CREATE_GOOGLE_TASKS,
  MUTATION_CREATE_JIRA_ISSUE,
  MUTATION_CREATE_TODOIST_TASK,
  MUTATION_CREATE_TRELLO_CARD,
} from "src/components/drawer/SideDrawer.operations";
import GoogleTasksIcon from "src/components/icons/GoogleTasksIcon";
import JiraIcon from "src/components/icons/JiraIcon";
import MarkurzIcon from "src/components/icons/MarkurzIcon";
import TodoistIcon from "src/components/icons/TodoistIcon";
import TrelloIcon from "src/components/icons/TrelloIcon";
import GoogleTasks from "src/components/tasks/GoogleTasks";
import Jira from "src/components/tasks/Jira";
import Todoist from "src/components/tasks/Todoist";
import Trello from "src/components/tasks/Trello";
import { graphql } from "src/generated";
import { ModuleTypeEnum } from "src/generated/graphql";
import { useTokenShared } from "src/lib/token";

const QUERY_MODULES = graphql(/* GraphQL */ `
  query UserModules($take: Int) {
    userModules(take: $take) {
      elements {
        id
        email
        module {
          id
          type
        }
        validKey
      }
      meta {
        totalCount
      }
    }
  }
`);

interface SideDrawerProps extends DrawerProps {
  highlightedText: string;
}

const APPS: {
  [p in ModuleTypeEnum]: {
    name: string;
    icon: React.JSX.Element;
    Element: <T extends { userModuleId: string; highlightedText: string }>(
      props: T
    ) => React.JSX.Element;
    mutation: DocumentNode;
  };
} = {
  [ModuleTypeEnum.GoogleTasks]: {
    name: "Google Tasks",
    icon: <GoogleTasksIcon />,
    Element: GoogleTasks,
    mutation: MUTATION_CREATE_GOOGLE_TASKS,
  },
  [ModuleTypeEnum.Jira]: {
    name: "Jira",
    icon: <JiraIcon />,
    Element: Jira,
    mutation: MUTATION_CREATE_JIRA_ISSUE,
  },
  [ModuleTypeEnum.Todoist]: {
    name: "Todoist",
    icon: <TodoistIcon />,
    Element: Todoist,
    mutation: MUTATION_CREATE_TODOIST_TASK,
  },
  [ModuleTypeEnum.Trello]: {
    name: "Trello",
    icon: <TrelloIcon />,
    Element: Trello,
    mutation: MUTATION_CREATE_TRELLO_CARD,
  },
};

const SideDrawer = (props: SideDrawerProps) => {
  const { highlightedText, ...drawerProps } = props;
  const [selectedApp, setSelectedApp] = useState<"" | ModuleTypeEnum>("");
  const methods = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const {
    handleSubmit,
    reset,
    formState: { isValid, isDirty },
  } = methods;
  const { href } = useLocation();
  const { token } = useTokenShared();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const { data, refetch } = useQuery(QUERY_MODULES, {
    skip: !token,
    variables: {
      take: 100,
    },
  });

  useEffect(() => {
    if (drawerProps.open) {
      refetch();
    }
  }, [drawerProps.open, refetch]);

  useEffect(() => {
    // Reset the result if form gets dirty
    if (isDirty) {
      setResult("");
    }
  }, [isDirty]);

  useEffect(() => {
    // If the selection changes reset the result to be ready to get a new url.
    setResult("");
    reset({
      sourceText: highlightedText,
    });
  }, [highlightedText, reset]);

  const submit = async (form: FieldValues) => {
    form.sourceUrl = href;
    if (selectedApp) {
      setLoading(true);
      try {
        const { data: result } = await apolloClient.mutate({
          mutation:
            // Split on dash to get the first part which is the APP key, second part being the account
            APPS[selectedApp.split("-")[0] as keyof typeof APPS].mutation,
          variables: form,
        });
        setResult(result?.create.outputUrl);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
        // Suppress the dirty state of the form to allow a re-submit
        reset(form, { keepValues: true });
      }
    }
  };

  const handleAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedApp(e.target.value as ModuleTypeEnum);
      reset({
        sourceText: highlightedText,
      });
    }
  };

  return (
    <Drawer
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: 375, sm: 420 },
          maxWidth: "100vw",
        },
      }}
      ModalProps={{
        container: document.getElementById("markurz-root"),
        style: {
          zIndex: 1201,
        },
      }}
      {...drawerProps}
    >
      <Stack spacing={1} p={2} direction="row" alignItems="center">
        <Box flexGrow={1}>
          <MarkurzIcon color="primary" />
        </Box>
        <Button
          type="button"
          href={`${process.env.REACT_APP_LOGIN_URL}/dashboard`}
          rel="noopener"
          target="_blank"
        >
          Dashboard
        </Button>
        <IconButton onClick={() => props.onClose?.({}, "backdropClick")}>
          <Close />
        </IconButton>
      </Stack>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(submit)}
          style={{ height: "100%", display: "flex", flexDirection: "column" }}
        >
          <Stack spacing={3} p={2} sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="p"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordBreak: "break-all",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {highlightedText}
            </Typography>
            <TextField
              select
              required
              size="small"
              label="Select apps"
              value={selectedApp}
              onChange={handleAppChange}
              sx={{
                "& .MuiSelect-select": {
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                },
                "& .MuiListItemText-root": {
                  margin: 0,
                },
                "& .MuiListItemIcon-root": {
                  minWidth: "unset",
                },
              }}
            >
              <MenuItem
                component="a"
                href={`${process.env.REACT_APP_LOGIN_URL}`}
                target="_blank"
                rel="noopener"
              >
                <ListItemIcon>
                  <Add fontSize="small" color="primary" />
                </ListItemIcon>
                <ListItemText sx={{ color: "primary.main" }}>
                  Connect More Apps
                </ListItemText>
              </MenuItem>
              {data?.userModules?.elements?.map((userModule) => (
                <Tooltip
                  title={
                    !userModule.validKey &&
                    "Connection expired. Go to Dashboard > My Apps and reconnect."
                  }
                  key={userModule.id}
                  placement="top"
                >
                  <div>
                    <MenuItem
                      value={`${userModule.module.type}-${userModule.id}`}
                      disabled={!userModule.validKey}
                    >
                      <ListItemIcon>
                        {APPS[userModule.module.type].icon}
                      </ListItemIcon>
                      <ListItemText>
                        {APPS[userModule.module.type].name} ({userModule.email})
                      </ListItemText>
                    </MenuItem>
                  </div>
                </Tooltip>
              ))}
            </TextField>
            <TabContext value={selectedApp}>
              {data?.userModules?.elements?.map((userModule) => (
                <TabPanel
                  key={userModule.id}
                  value={`${userModule.module.type}-${userModule.id}`}
                >
                  {React.createElement(APPS[userModule.module.type].Element, {
                    userModuleId: userModule.id,
                    highlightedText,
                  })}
                </TabPanel>
              ))}
            </TabContext>
          </Stack>
          <Paper
            square
            elevation={0}
            sx={{
              position: "sticky",
              left: 16,
              bottom: 16,
              width: "calc(100% - 32px)",
              mt: 3,
              zIndex: 1,
            }}
          >
            <LoadingButton
              fullWidth
              disabled={!isValid}
              startIcon={result ? <Link /> : undefined}
              variant="contained"
              type={result ? "button" : "submit"}
              loading={loading}
              color={result ? "secondary" : "primary"}
              href={result}
              rel="noopener"
              target="_blank"
            >
              {result ? "Link" : "Send"}
            </LoadingButton>
          </Paper>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default SideDrawer;
