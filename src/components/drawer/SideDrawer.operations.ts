import { graphql } from "src/generated";

export const MUTATION_CREATE_GOOGLE_TASKS = graphql(/* GraphQL */ `
  mutation CreateGoogleTasksTask(
    $element: GoogleTasksTaskArgs!
    $userModuleId: ID!
    $sourceUrl: String!
  ) {
    createGoogleTasksTask(
      element: $element
      userModuleId: $userModuleId
      sourceUrl: $sourceUrl
    ) {
      id
    }
  }
`);
