
const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

const config = require('./health-config');
const expressHealth = require('../src/connect');

app.use(expressHealth(config));

app.get('/hello', (req, res) =>
  res.send("Hello, Welcome to Express health test server"),
);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Express health test server listening on http://0.0.0.0:${port}`);
});
