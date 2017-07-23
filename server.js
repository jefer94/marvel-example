const express = require('express');

const app     = express();
const port    = 3000;
const Module  = require('./lib/loader.js')
const marvel  = require('./lib/marvel.js')

app
  .set('view engine', 'pug')
  .set('views', `${__dirname}/src/pug`)
  .get('/', (req, res) => {
    res.render('app', {
      look: require(`${__dirname}/src/stylus/marvel.search.styl`),
      require: require,
      ts: marvel.ts,
      public: marvel.public,
      hash: marvel.hash
    });
  })
  .get('/search/:id', (req, res) => {
    res.render('search');
  })
  .get('/assets/:id', (req, res) => {
    //let res = fs.readFileSync(`${__dirname}/public${ctx.path}`);
    //ctx.body = res.toString(`${__dirname}../src`, '/assets')
    //ctx.body = res;
  })
  .listen(port, () => {
    console.log(`  Express server listening on port ${port}`);
  });
