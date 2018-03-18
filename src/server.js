import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Sample from './shared/sample';


function renderToHTML(Element, initialProps) { 
    const html = ReactDOMServer.renderToString(Element);

    return `<!DOCTYPE html>
<html>
    <head>
        <title>SSR</title>
        <script defer type="text/javascript" src="bundle.js"></script>
        <link rel="stylesheet" href="styles.css">
    </head>
    <body>
        <div id="root">${html}</div>
        <script type="text/javascript">
            window.__INITIAL_PROPS__ = JSON.parse('${JSON.stringify(initialProps)}');
        </script>
    </body>
</html>
`;
}

const app = express();

app.use(express.static('dist'));

app.get('/*', async (req, res) => {

    const initialProps = await Sample.getInitialProps({ req });

    const Element = <Sample {...initialProps} />;

    res.send(renderToHTML(Element, initialProps));
});

export default app;