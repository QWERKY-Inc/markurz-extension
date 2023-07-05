import { DocumentNode } from "@apollo/client";
import React from "react";
import {
  MUTATION_CREATE_EVERNOTE_NOTE,
  MUTATION_CREATE_GOOGLE_TASKS,
  MUTATION_CREATE_JIRA_ISSUE,
  MUTATION_CREATE_TODOIST_TASK,
  MUTATION_CREATE_TRELLO_CARD,
} from "src/components/drawer/SideDrawer.operations";
import EvernoteIcon from "src/components/icons/EvernoteIcon";
import GoogleTasksIcon from "src/components/icons/GoogleTasksIcon";
import JiraIcon from "src/components/icons/JiraIcon";
import TodoistIcon from "src/components/icons/TodoistIcon";
import TrelloIcon from "src/components/icons/TrelloIcon";
import Evernote from "src/components/tasks/Evernote";
import GoogleTasks from "src/components/tasks/GoogleTasks";
import Jira from "src/components/tasks/Jira";
import Todoist from "src/components/tasks/Todoist";
import Trello from "src/components/tasks/Trello";
import { ModuleTypeEnum } from "src/generated/graphql";

export const APPS: {
  [p in ModuleTypeEnum]: {
    name: string;
    taskName: string;
    icon: React.JSX.Element;
    Element: <T extends { userModuleId: string; highlightedText: string }>(
      props: T
    ) => React.JSX.Element;
    mutation: DocumentNode;
  };
} = {
  [ModuleTypeEnum.Evernote]: {
    name: "Evernote",
    taskName: "Note",
    icon: <EvernoteIcon />,
    Element: Evernote,
    mutation: MUTATION_CREATE_EVERNOTE_NOTE,
  },
  [ModuleTypeEnum.Gmail]: {
    name: "Gmail",
    taskName: "email",
    icon: <GoogleTasksIcon />,
    Element: GoogleTasks,
    mutation: MUTATION_CREATE_GOOGLE_TASKS,
  },
  [ModuleTypeEnum.GoogleCalendar]: {
    name: "Google Calendar",
    taskName: "event",
    icon: <GoogleTasksIcon />,
    Element: GoogleTasks,
    mutation: MUTATION_CREATE_GOOGLE_TASKS,
  },
  [ModuleTypeEnum.GoogleTasks]: {
    name: "Google Tasks",
    taskName: "task",
    icon: <GoogleTasksIcon />,
    Element: GoogleTasks,
    mutation: MUTATION_CREATE_GOOGLE_TASKS,
  },
  [ModuleTypeEnum.Jira]: {
    name: "Jira",
    taskName: "issue",
    icon: <JiraIcon />,
    Element: Jira,
    mutation: MUTATION_CREATE_JIRA_ISSUE,
  },
  [ModuleTypeEnum.Todoist]: {
    name: "Todoist",
    taskName: "task",
    icon: <TodoistIcon />,
    Element: Todoist,
    mutation: MUTATION_CREATE_TODOIST_TASK,
  },
  [ModuleTypeEnum.Trello]: {
    name: "Trello",
    taskName: "card",
    icon: <TrelloIcon />,
    Element: Trello,
    mutation: MUTATION_CREATE_TRELLO_CARD,
  },
};
