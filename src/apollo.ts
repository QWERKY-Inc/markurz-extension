import {
  ApolloClient,
  createHttpLink,
  from,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { getToken, openSignInWindow } from "src/lib/token";

const authLink = setContext(async (_, { headers }) => {
  try {
    const token = getToken();
    if (token) {
      return {
        headers: {
          ...headers,
          authorization: headers?.authorization
            ? headers.authorization
            : `Bearer ${token}`,
        },
      };
    }
    return headers;
  } catch (e) {
    console.error("[authLink]", e);
    return headers;
  }
});

const link = createHttpLink({
  uri: `${process.env.REACT_APP_BACKEND_URL}/graphql`,
  credentials: "same-origin",
});

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case "UNAUTHENTICATED":
          openSignInWindow();
      }
    }
  }
});

export const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  name: "markurz-extension",
  link: from([errorLink, authLink.concat(link)]),
});
