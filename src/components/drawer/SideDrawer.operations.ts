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

export const QUERY_MODULES = graphql(/* GraphQL */ `
  query UserModules($take: Int, $order: [UserModuleOrderBy!]) {
    userModules(take: $take, order: $order) {
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
