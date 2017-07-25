const express = require('express');
const fs      = require('fs');

const app     = express();
const port    = 3000;
const Module  = require('./lib/loader.js');
const marvel  = require('./lib/marvel.js');

function compress(fn) {
  var file = fs.readFileSync(fn).toString('utf8');
  for (let index in environment) {
    if (typeof environment[index] != 'object')
      file = file
        .replace(
          RegExp(`#\{${index}\}`, 'g'),
          environment[index]
        )
  }
  return `${file}`;
};

const environment = {
  compress: compress,
  require: require,
  ts: marvel.ts,
  public: marvel.public,
  hash: marvel.hash
};

app
  .set('view engine', 'pug')
  .set('views', `${__dirname}/src/pug`)
  .get('/', (req, res) => {
    res.render('app', environment);
  })
  .get('/test', (req, res) => {
    res.render('test', environment);
  })
  .listen(port, () => {
    console.log(`  Express server listening on port ${port}`);
  });
