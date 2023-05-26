// import { gql } from "@apollo/client";
// import { apolloClient } from "./apollo";
//
// const endpoint = "YOUR_GRAPHQL_ENDPOINT";
//
// const mutation = gql`
//   mutation CreateNotification($content: String!) {
//     createNotification(content: $content) {
//       id
//       success
//       message
//     }
//   }
// `;
//
// export async function sendNotificationToBackend(
//   content: string
// ): Promise<boolean> {
//   const variables = { content };
//
//   try {
//     const data = await apolloClient.mutate({
//       mutation,
//       variables,
//     });
//     return !!data.createNotification;
//   } catch (error) {
//     console.error("GraphQL error:", error);
//     return false;
//   }
// }

export {}
