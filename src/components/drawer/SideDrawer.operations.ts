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
    createJiraIssue(
      sourceUrl: $sourceUrl
      userModuleId: $userModuleId
      element: $element
    ) {
      id
      outputUrl
    }
  }
`);
