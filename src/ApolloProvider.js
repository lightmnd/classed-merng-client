import React from "react";
import App from "./App";
import ApolloClient from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from "apollo-link-http";
import { createUploadLink } from 'apollo-upload-client'
import { ApolloProvider } from "@apollo/react-hooks";
import { setContext } from 'apollo-link-context'


// const httpLink = createHttpLink({
//   uri: "https://polar-brook-46695.herokuapp.com/"
// });

// const upload = createUploadLink({ uri: "http://localhost:4000/graphql" });
const upload = createUploadLink({ uri: "https://polar-brook-46695.herokuapp.com/graphql" });

const authLink = setContext(() => {
  const token = localStorage.getItem('jwtToken')
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const client = new ApolloClient({
  // link: authLink.concat(httpLink, upload),
  link: authLink.concat(upload),
  cache: new InMemoryCache()
});


export default (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
