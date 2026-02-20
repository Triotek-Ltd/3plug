import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#2563EB" />
        <meta name="description" content="3plug platform by Triotek Ltd" />
        <meta name="application-name" content="3plug" />
        <meta property="og:site_name" content="3plug" />
        <meta property="og:title" content="3plug by Triotek Ltd" />
        <meta property="og:description" content="3plug platform by Triotek Ltd" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/brand/logo-3plug.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="3plug by Triotek Ltd" />
        <meta name="twitter:description" content="3plug platform by Triotek Ltd" />
        <meta name="twitter:image" content="/brand/logo-3plug.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700"
          rel="stylesheet"
        />
        <script
          async
          src="https://kit.fontawesome.com/42d5adcbca.js"
          crossOrigin="anonymous"
        ></script>
        <link href="/css/nucleo-icons.css" rel="stylesheet" />
        <link href="/css/nucleo-svg.css" rel="stylesheet" />
        <link
          href="/css/soft-ui-dashboard-tailwind.css?v=1.0.5"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
