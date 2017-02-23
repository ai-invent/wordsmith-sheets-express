const path = require('path');
const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('../config/webpack.config.js')();
const APIResponse = require('./response/api');

const IS_DEV = process.env.NODE_ENV !== 'production';
const PORT = IS_DEV ? 3000 : process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.set('view engine', 'ejs');

if (IS_DEV) {
  const compiler = webpack(config);
  const middleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false,
    },
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, '/../dist/index.ejs')));
    res.end();
  });
} else {
  app.use(express.static(path.join(__dirname, '/../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

app.post('/api/update', function(req, res) {
  APIResponse.onUpdate(req, res);
});

app.listen(PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.info(`Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`);
});
