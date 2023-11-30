import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const createApolloClient = () => {
    return new ApolloClient({
        uri: "http://localhost:8080/graphql",
        cache: new InMemoryCache(),
    });
};

export default createApolloClient;