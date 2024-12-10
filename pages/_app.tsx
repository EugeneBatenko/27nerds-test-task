import { AppProps } from "next/app";
import "../styles/index.css";
import { ApolloProvider } from '@apollo/client';
import client from '../lib/apollo';

function MyApp({ Component, pageProps }: AppProps) {
  return (<ApolloProvider client={client}>
    <Component {...pageProps} />
  </ApolloProvider>)
}

export default MyApp;
