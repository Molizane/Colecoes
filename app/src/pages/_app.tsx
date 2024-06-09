import "bootstrap/dist/css/bootstrap.min.css";
import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Head from "next/head";

import { Header } from '../components/Header';

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default App
