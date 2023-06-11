import { graphql } from "src/generated";

export const MUTATION_CREATE_GOOGLE_TASKS = graphql(/* GraphQL */ `
  mutation CreateGoogleTasksTask(
    $element: GoogleTasksTaskArgs!
    $userModuleId: ID!
    $sourceUrl: String!
  ) {
    create: createGoogleTasksTask(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
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
  ) {
    create: createJiraIssue(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
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
  ) {
    create: createTodoistTask(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
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
  ) {
    create: createTrelloCard(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
    ) {
      id
      outputUrl
    }
  }
`);
