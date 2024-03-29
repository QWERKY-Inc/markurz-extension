import { DocumentNode } from "@apollo/client";
import React from "react";
import { FieldValues } from "react-hook-form";
import {
  MUTATION_CREATE_ASANA_TASK,
  MUTATION_CREATE_EVERNOTE_NOTE,
  MUTATION_CREATE_GMAIL_EMAIL,
  MUTATION_CREATE_GOOGLE_CALENDAR_EVENT,
  MUTATION_CREATE_GOOGLE_TASKS,
  MUTATION_CREATE_JIRA_ISSUE,
  MUTATION_CREATE_MICROSOFT_ONENOTE,
  MUTATION_CREATE_MICROSOFT_TODO,
  MUTATION_CREATE_MONDAY_ITEM,
  MUTATION_CREATE_NOTION_PAGE,
  MUTATION_CREATE_SLACK_MESSAGE,
  MUTATION_CREATE_TODOIST_TASK,
  MUTATION_CREATE_TRELLO_CARD,
} from "src/components/drawer/SideDrawer.operations";
import AsanaIcon from "src/components/icons/AsanaIcon";
import EvernoteIcon from "src/components/icons/EvernoteIcon";
import GmailIcon from "src/components/icons/GmailIcon";
import GoogleCalendarIcon from "src/components/icons/GoogleCalendarIcon";
import GoogleTasksIcon from "src/components/icons/GoogleTasksIcon";
import JiraIcon from "src/components/icons/JiraIcon";
import MicrosoftOneNoteIcon from "src/components/icons/MicrosoftOneNoteIcon";
import MicrosoftTodoIcon from "src/components/icons/MicrosoftTodoIcon";
import MondayIcon from "src/components/icons/MondayIcon";
import NotionIcon from "src/components/icons/NotionIcon";
import SlackIcon from "src/components/icons/SlackIcon";
import TodoistIcon from "src/components/icons/TodoistIcon";
import TrelloIcon from "src/components/icons/TrelloIcon";
import Asana from "src/components/tasks/Asana";
import Evernote from "src/components/tasks/Evernote";
import Gmail from "src/components/tasks/Gmail";
import GoogleCalendar from "src/components/tasks/GoogleCalendar";
import GoogleTasks from "src/components/tasks/GoogleTasks";
import Jira from "src/components/tasks/Jira";
import MicrosoftOneNote from "src/components/tasks/MicrosoftOneNote";
import MicrosoftToDo from "src/components/tasks/MicrosoftToDo";
import Monday from "src/components/tasks/Monday";
import Notion from "src/components/tasks/Notion";
import Slack from "src/components/tasks/Slack";
import Todoist from "src/components/tasks/Todoist";
import Trello from "src/components/tasks/Trello";
import {
  ModuleTypeEnum,
  SlackMessageReceiverTypeEnum,
} from "src/generated/graphql";

export const APPS: {
  [p in ModuleTypeEnum]?: {
    name: string;
    taskName: string;
    icon: React.JSX.Element;
    Element: <T extends { userModuleId: string; highlightedText: string }>(
      props: T,
    ) => React.JSX.Element;
    mutation: DocumentNode;
    missingUrlTooltipMessage?: string;
    transformer?: <T extends FieldValues>(value: T) => object;
  };
} = {
  [ModuleTypeEnum.Asana]: {
    name: "Asana",
    taskName: "Task",
    icon: <AsanaIcon />,
    Element: Asana,
    mutation: MUTATION_CREATE_ASANA_TASK,
  },
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
  [ModuleTypeEnum.MicrosoftOnenote]: {
    name: "Microsoft OneNote",
    taskName: "Page",
    icon: <MicrosoftOneNoteIcon />,
    Element: MicrosoftOneNote,
    mutation: MUTATION_CREATE_MICROSOFT_ONENOTE,
    transformer(value) {
      const {
        element: { notebookId, ...restElement },
        ...rest
      } = value;
      return {
        ...rest,
        element: {
          ...restElement,
        },
      };
    },
  },
  [ModuleTypeEnum.MicrosoftTodo]: {
    name: "Microsoft To Do",
    taskName: "task",
    icon: <MicrosoftTodoIcon />,
    Element: MicrosoftToDo,
    mutation: MUTATION_CREATE_MICROSOFT_TODO,
  },
  [ModuleTypeEnum.Monday]: {
    name: "Monday",
    taskName: "item",
    icon: <MondayIcon />,
    Element: Monday,
    mutation: MUTATION_CREATE_MONDAY_ITEM,
    transformer(value) {
      const {
        element: { workspace, group, ...restElement },
        ...rest
      } = value;
      return {
        ...rest,
        element: {
          ...restElement,
          groupId: group.id,
          boardId: group.board.id,
        },
      };
    },
  },
  [ModuleTypeEnum.Notion]: {
    name: "Notion",
    taskName: "New Page",
    icon: <NotionIcon />,
    Element: Notion,
    mutation: MUTATION_CREATE_NOTION_PAGE,
  },
  [ModuleTypeEnum.Slack]: {
    name: "Slack",
    taskName: "Message",
    icon: <SlackIcon />,
    Element: Slack,
    mutation: MUTATION_CREATE_SLACK_MESSAGE,
    missingUrlTooltipMessage:
      "DMs sent to other user cannot be viewed by the sender due to DM being sent to Markurz app in Slack app messages.",
    transformer(value) {
      const {
        element: { receiver, ...restElement },
        ...rest
      } = value;
      return {
        ...rest,
        element: {
          ...restElement,
          receiverId: receiver.id,
          receiverType:
            receiver.__typename === "SlackChannel"
              ? SlackMessageReceiverTypeEnum.Channel
              : SlackMessageReceiverTypeEnum.User,
        },
      };
    },
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
