import { useQuery } from "@apollo/client";
import { Add } from "@mui/icons-material";
import { LoadingButton, TabContext, TabPanel } from "@mui/lab";
import {
  Button,
  Drawer,
  DrawerProps,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { FieldValues, FormProvider, useForm } from "react-hook-form";
import { useLocation } from "react-use";
import GoogleTasksIcon from "src/components/icons/GoogleTasksIcon";
import GoogleTasks from "src/components/tasks/GoogleTasks";
import { graphql } from "src/generated";
import { ModuleTypeEnum } from "src/generated/graphql";
import { useToken } from "src/lib/token";

const QUERY_MODULES = graphql(/* GraphQL */ `
  query UserModules($take: Int) {
    userModules(take: $take) {
      elements {
        module {
          id
          type
        }
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
  [p in ModuleTypeEnum]: { name: string; icon: React.JSX.Element };
} = {
  [ModuleTypeEnum.GoogleTasks]: {
    name: "Google Tasks",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.AppleCalendar]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.AppleReminders]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.GoogleCalendar]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.GoogleDocs]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.Jira]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.Notion]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.Todoist]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
  [ModuleTypeEnum.Trello]: {
    name: "",
    icon: <GoogleTasksIcon />,
  },
};

const SideDrawer = (props: SideDrawerProps) => {
  const { highlightedText, ...drawerProps } = props;
  const [selectedApp, setSelectedApp] = useState<"" | ModuleTypeEnum>("");
  const methods = useForm();
  const { handleSubmit, reset } = methods;
  const { href } = useLocation();
  const { token } = useToken();

  const { data } = useQuery(QUERY_MODULES, {
    skip: !token,
    variables: {
      take: 100,
    },
  });

  const submit = (form: FieldValues) => {
    form.href = href;
    console.log("submit", form);
  };

  const handleAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setSelectedApp(e.target.value as ModuleTypeEnum);
      reset({
        title: highlightedText,
      });
    }
  };

  return (
    <Drawer
      anchor="right"
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "90vw", md: "35vw" },
          maxWidth: 420,
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
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(submit)}>
          <Stack spacing={3} p={2}>
            <Typography
              variant="h4"
              component="p"
              sx={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {highlightedText}
            </Typography>
            <TextField
              select
              required
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
                  <Add fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add Apps</ListItemText>
              </MenuItem>
              {data?.userModules.elements?.map((userModule) => (
                <MenuItem
                  key={userModule.module.id}
                  value={userModule.module.type}
                >
                  <ListItemIcon>
                    {APPS[userModule.module.type].icon}
                  </ListItemIcon>
                  {APPS[userModule.module.type].name}
                </MenuItem>
              ))}
              {/*<MenuItem value="jira">*/}
              {/*  <ListItemIcon>*/}
              {/*    <MarkurzIcon fontSize="small" />*/}
              {/*  </ListItemIcon>*/}
              {/*  <ListItemText>Jira</ListItemText>*/}
              {/*</MenuItem>*/}
              {/*<MenuItem value="google-tasks">*/}
              {/*  <ListItemIcon>*/}
              {/*    <GoogleTasksIcon fontSize="small" />*/}
              {/*  </ListItemIcon>*/}
              {/*  <ListItemText>Google Tasks</ListItemText>*/}
              {/*</MenuItem>*/}
            </TextField>
            <TabContext value={selectedApp}>
              <TabPanel value={ModuleTypeEnum.Jira}>jira</TabPanel>
              <TabPanel value={ModuleTypeEnum.GoogleTasks}>
                <GoogleTasks />
              </TabPanel>
            </TabContext>
            <LoadingButton variant="contained" type="submit">
              Send
            </LoadingButton>
            <Button
              type="button"
              href="https://launch.markurz.com/"
              rel="noopener"
              target="_blank"
            >
              Dashboard
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </Drawer>
  );
};

export default SideDrawer;
