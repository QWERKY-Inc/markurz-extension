import { DocumentNode } from "@apollo/client";
import React from "react";
import {
  MUTATION_CREATE_EVERNOTE_NOTE,
  MUTATION_CREATE_GMAIL_EMAIL,
  MUTATION_CREATE_GOOGLE_CALENDAR_EVENT,
  MUTATION_CREATE_GOOGLE_TASKS,
  MUTATION_CREATE_JIRA_ISSUE,
  MUTATION_CREATE_MICROSOFT_TODO,
  MUTATION_CREATE_NOTION_PAGE,
  MUTATION_CREATE_TODOIST_TASK,
  MUTATION_CREATE_TRELLO_CARD,
} from "src/components/drawer/SideDrawer.operations";
import EvernoteIcon from "src/components/icons/EvernoteIcon";
import GmailIcon from "src/components/icons/GmailIcon";
import GoogleCalendarIcon from "src/components/icons/GoogleCalendarIcon";
import GoogleTasksIcon from "src/components/icons/GoogleTasksIcon";
import JiraIcon from "src/components/icons/JiraIcon";
import MicrosoftTodoIcon from "src/components/icons/MicrosoftTodoIcon";
import NotionIcon from "src/components/icons/NotionIcon";
import TodoistIcon from "src/components/icons/TodoistIcon";
import TrelloIcon from "src/components/icons/TrelloIcon";
import Evernote from "src/components/tasks/Evernote";
import Gmail from "src/components/tasks/Gmail";
import GoogleCalendar from "src/components/tasks/GoogleCalendar";
import GoogleTasks from "src/components/tasks/GoogleTasks";
import Jira from "src/components/tasks/Jira";
import MicrosoftToDo from "src/components/tasks/MicrosoftToDo";
import Notion from "src/components/tasks/Notion";
import Todoist from "src/components/tasks/Todoist";
import Trello from "src/components/tasks/Trello";
import { ModuleTypeEnum } from "src/generated/graphql";

export const APPS: {
  [p in ModuleTypeEnum]?: {
    name: string;
    taskName: string;
    icon: React.JSX.Element;
    Element: <T extends { userModuleId: string; highlightedText: string }>(
      props: T,
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
    taskName: "Message",
    icon: <GmailIcon />,
    Element: Gmail,
    mutation: MUTATION_CREATE_GMAIL_EMAIL,
  },
  [ModuleTypeEnum.GoogleCalendar]: {
    name: "Google Calendar",
    taskName: "Event",
    icon: <GoogleCalendarIcon />,
    Element: GoogleCalendar,
    mutation: MUTATION_CREATE_GOOGLE_CALENDAR_EVENT,
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
  [ModuleTypeEnum.MicrosoftTodo]: {
    name: "Microsoft To Do",
    taskName: "card",
    icon: <MicrosoftTodoIcon />,
    Element: MicrosoftToDo,
    mutation: MUTATION_CREATE_MICROSOFT_TODO,
  },
  [ModuleTypeEnum.Notion]: {
    name: "Notion",
    taskName: "New Page",
    icon: <NotionIcon />,
    Element: Notion,
    mutation: MUTATION_CREATE_NOTION_PAGE,
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
