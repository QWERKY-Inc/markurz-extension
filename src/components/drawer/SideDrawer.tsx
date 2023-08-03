import { ApolloError, useLazyQuery } from "@apollo/client";
import { Add, Close, Link, PowerOff } from "@mui/icons-material";
import { LoadingButton, TabContext, TabPanel } from "@mui/lab";
import {
  Alert,
  Box,
  Button,
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
import { apolloClient } from "src/apollo";
import { APPS } from "src/components/drawer/Apps";
import Limit from "src/components/drawer/Limit";
import LoggedOutScreen from "src/components/drawer/LoggedOutScreen";
import { QUERY_MODULES } from "src/components/drawer/SideDrawer.operations";
import MarkurzIcon from "src/components/icons/MarkurzIcon";
import {
  ModuleTypeEnum,
  OrderByEnum,
  UserModuleStatusEnum,
} from "src/generated/graphql";
import { useTokenShared } from "src/lib/token";

interface SideDrawerProps extends DrawerProps {
  highlightedText: string;
}

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
  const { token, loading: tokenLoading } = useTokenShared();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    appName: string;
    taskName: string;
    url: string;
    tooltipMessage?: string;
  } | null>(null);
  const [errorMutation, setErrorMutation] = useState("");

  const [queryModules, { data, error, loading: loadingModules }] = useLazyQuery(
    QUERY_MODULES,
    {
      // This skip should be there but seems to break global refetch
      // skip: !token || !drawerProps.open || tokenLoading,
      variables: {
        take: 100,
        order: [
          {
            module: {
              name: OrderByEnum.Asc,
            },
          },
        ],
        where: {
          status: {
            in: [
              UserModuleStatusEnum.Active,
              UserModuleStatusEnum.TemporaryDisabled,
            ],
          },
        },
      },
    },
  );

  useEffect(() => {
    if (drawerProps.open && token) {
      queryModules();
    }
  }, [drawerProps.open, token, queryModules]);

  useEffect(() => {
    // Reset the result if form gets dirty
    if (isDirty) {
      setResult(null);
      setErrorMutation("");
    }
  }, [isDirty]);

  useEffect(() => {
    // If the selection changes reset the result to be ready to get a new url.
    setResult(null);
    setErrorMutation("");
    reset({
      sourceText: highlightedText,
    });
  }, [highlightedText, reset]);

  const submit = async (form: FieldValues) => {
    form.sourceUrl = document.location.href;
    const appKey = selectedApp?.split("-")[0] as keyof typeof APPS;
    const currentApp = APPS[appKey];
    if (currentApp) {
      setLoading(true);
      try {
        const { data: result } = await apolloClient.mutate({
          mutation:
            // Split on dash to get the first part which is the APP key, second part being the account
            currentApp.mutation,
          variables: form,
        });
        setErrorMutation("");
        setResult({
          appName: currentApp.name,
          taskName: currentApp.taskName,
          url: result?.create.outputUrl,
          tooltipMessage: result?.create
            ? result?.create.outputUrl
              ? `${currentApp.taskName} created! Click to check and input additional information in ${currentApp.taskName}`
              : currentApp.missingUrlTooltipMessage
            : undefined,
        });
      } catch (e) {
        console.error(e);
        if (e instanceof ApolloError) {
          setErrorMutation(e.message);
        } else {
          setErrorMutation((e as Error).toString());
        }
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
      setResult(null);
      setErrorMutation("");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "100vw",
        height: "100%",
        overflow: "hidden",
      }}
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
          sx={{
            color: (t) => `${t.palette.primary.main} !important`,
            textDecoration: "none",
          }}
        >
          Dashboard
        </Button>
        <IconButton onClick={() => props.onClose?.({}, "escapeKeyDown")}>
          <Close />
        </IconButton>
      </Stack>
      {!token || error ? (
        <LoggedOutScreen loading={tokenLoading} />
      ) : data?.usage &&
        typeof data.usage.createdEvent.limitCount === "number" &&
        data.usage.createdEvent.limitCount <= data.usage.createdEvent.count ? (
        <Limit />
      ) : (
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(submit)}
            style={{ height: "100%", display: "flex", flexDirection: "column" }}
          >
            <Stack
              spacing={3}
              p={2}
              sx={{ flexGrow: 1, overflowY: "auto", mb: 10 }}
            >
              <Typography
                variant="h5"
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
                {loadingModules && <MenuItem disabled>Loading...</MenuItem>}
                {data?.userModules?.elements?.map((userModule) => {
                  const currentApp = APPS[userModule.module.type];
                  if (!currentApp) return null;
                  return (
                    <MenuItem
                      value={`${userModule.module.type}-${userModule.id}`}
                      disabled={
                        !(
                          userModule.validKey &&
                          userModule.status === UserModuleStatusEnum.Active
                        )
                      }
                      key={userModule.id}
                    >
                      <ListItemIcon>{currentApp.icon}</ListItemIcon>
                      <ListItemText
                        sx={{ "& > span": { display: "flex", gap: 1 } }}
                      >
                        {currentApp.name} ({userModule.email}){" "}
                        {!userModule.validKey && <PowerOff />}
                      </ListItemText>
                    </MenuItem>
                  );
                })}
              </TextField>
              <TabContext value={selectedApp}>
                {data?.userModules?.elements?.map((userModule) => {
                  const currentApp = APPS[userModule.module.type];
                  if (!currentApp) return null;
                  return (
                    <TabPanel
                      key={userModule.id}
                      value={`${userModule.module.type}-${userModule.id}`}
                    >
                      {React.createElement(currentApp.Element, {
                        userModuleId: userModule.id,
                        highlightedText,
                      })}
                    </TabPanel>
                  );
                })}
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
              {errorMutation && (
                <Alert severity="error" variant="outlined" sx={{ mb: 2 }}>
                  {errorMutation}
                </Alert>
              )}
              <Tooltip title={result?.tooltipMessage || null} placement="top">
                <span>
                  <LoadingButton
                    fullWidth
                    disabled={!isValid || (!!result && !result.url)}
                    startIcon={result ? <Link /> : undefined}
                    variant="contained"
                    type={result ? "button" : "submit"}
                    loading={loading}
                    color={result ? "secondary" : "primary"}
                    href={result?.url || ""}
                    rel="noopener"
                    target="_blank"
                  >
                    {result
                      ? `Link to ${result.appName} ${result.taskName}`
                      : "Send"}
                  </LoadingButton>
                </span>
              </Tooltip>
            </Paper>
          </form>
        </FormProvider>
      )}
    </Box>
  );
};

export default SideDrawer;
