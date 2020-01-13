import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const props: any = { ...await Document.getInitialProps(ctx) };
    return props;
  }

  render() {
    return (
      <Html>
        <Head>
          <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1"/>
          <link rel="stylesheet" href="/bulma/css/bulma.min.css"></link>
          <link rel="stylesheet" href="/bulma/extensions/tooltip/bulma-tooltip.min.css"></link>
          <script defer src="https://use.fontawesome.com/releases/v5.3.1/js/all.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
};


export default MyDocument;