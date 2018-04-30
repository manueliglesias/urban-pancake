import { AWSAppSyncClient } from "aws-appsync";
import fetch from 'node-fetch'

import AppSyncConfig from "../AppSync";

let apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch
}

function create(initialState) {
  const client = new AWSAppSyncClient({
    url: AppSyncConfig.graphqlEndpoint,
    region: AppSyncConfig.region,
    auth: {
      type: AppSyncConfig.authType,
      apiKey: AppSyncConfig.apiKey,
    },
    disableOffline: true
  }, {
      ssrMode: true
    });
  
  if (initialState) {
    client.cache.restore(initialState);
  }

  return client;
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState)
  }

  return apolloClient
}
