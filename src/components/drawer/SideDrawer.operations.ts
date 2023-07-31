import { graphql } from "src/generated";

export const MUTATION_CREATE_GOOGLE_TASKS = graphql(/* GraphQL */ `
  mutation CreateGoogleTasksTask(
    $element: GoogleTasksTaskArgs!
    $userModuleId: ID!
    $sourceUrl: String!
    $sourceText: String!
  ) {
    create: createGoogleTasksTask(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_GOOGLE_CALENDAR_EVENT = graphql(/* GraphQL */ `
  mutation CreateGoogleCalendarEvent(
    $element: GoogleCalendarEventArgs!
    $userModuleId: ID!
    $sourceUrl: String!
    $sourceText: String!
  ) {
    create: createGoogleCalendarEvent(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_MICROSOFT_ONENOTE = graphql(/* GraphQL */ `
  mutation CreateMicrosoftOneNotePage(
    $element: CreateMicrosoftOneNotePageInput!
    $userModuleId: ID!
    $sourceUrl: String!
    $sourceText: String!
  ) {
    create: createMicrosoftOneNotePage(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_MICROSOFT_TODO = graphql(/* GraphQL */ `
  mutation CreateMicrosoftTodoTask(
    $element: CreateMicrosoftTodoTaskInput!
    $userModuleId: ID!
    $sourceUrl: String!
    $sourceText: String!
  ) {
    create: createMicrosoftTodoTask(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_GMAIL_EMAIL = graphql(/* GraphQL */ `
  mutation CreateGmailEmail(
    $element: GmailEmailArgs!
    $userModuleId: ID!
    $sourceUrl: String!
    $sourceText: String!
    $isDraft: Boolean!
  ) {
    create: createGMailEmail(
      isDraft: $isDraft
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_JIRA_ISSUE = graphql(/* GraphQL */ `
  mutation CreateJiraIssue(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: JiraInputArgs!
    $sourceText: String!
  ) {
    create: createJiraIssue(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_TODOIST_TASK = graphql(/* GraphQL */ `
  mutation CreateTodoistTask(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: TodoistTaskArgs!
    $sourceText: String!
  ) {
    create: createTodoistTask(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_NOTION_PAGE = graphql(/* GraphQL */ `
  mutation CreateNotionPage(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: CreateNotionPageInput!
    $sourceText: String!
  ) {
    create: createNotionPage(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_TRELLO_CARD = graphql(/* GraphQL */ `
  mutation CreateTrelloCard(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: TrelloCreateCardArgs!
    $sourceText: String!
  ) {
    create: createTrelloCard(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_EVERNOTE_NOTE = graphql(/* GraphQL */ `
  mutation CreateEvernoteNote(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: CreateEvernoteNoteInput!
    $sourceText: String!
  ) {
    create: createEvernoteNote(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_ASANA_TASK = graphql(/* GraphQL */ `
  mutation CreateAsanaTask(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: CreateAsanaTaskInput!
    $sourceText: String!
  ) {
    create: createAsanaTask(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const MUTATION_CREATE_MONDAY_ITEM = graphql(/* GraphQL */ `
  mutation CreateMondayItem(
    $sourceUrl: String!
    $userModuleId: ID!
    $element: MondayItemArgs!
    $sourceText: String!
  ) {
    create: createMondayItem(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
      sourceText: $sourceText
    ) {
      id
      outputUrl
    }
  }
`);

export const QUERY_MODULES = graphql(/* GraphQL */ `
  query UserModules(
    $take: Int
    $order: [UserModuleOrderBy!]
    $where: UserModuleWhere
  ) {
    usage {
      createdEvent {
        count
        limitCount
      }
    }
    userModules: newUserModules(take: $take, order: $order, where: $where) {
      elements {
        id
        email
        module {
          id
          type
        }
        validKey
        status
      }
      meta {
        totalCount
      }
    }
  }
`);
