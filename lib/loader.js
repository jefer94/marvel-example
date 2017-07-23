const stylus = require('stylus')
const fs = require('fs');
const Module = require('module');

Module._extensions['.png'] = function(module, fn) {
  var base64 = fs.readFileSync(fn).toString('base64');
  module._compile('module.exports="data:image/png;base64,' + base64 + '"', fn);
};

Module._extensions['.styl'] = function(module, fn) {
  let file = fs.readFileSync(fn, 'utf8');
  
  new stylus(file)
    .set('filename', `${__dirname}/src/stylus/marvel.search.styl`)
    .set('paths', [`${__dirname}/src/stylus/`])
    .render(function(err, css){
      if (err) console.error(err);
      css = css
        .replace(/[ ]{2,}/g, '')
        .replace(/\n/g, ' ')
        .replace(/ \./g, '.')
        .replace(/ #/g, '#')
        .replace(/; /g, ';')
        .replace(/: /g, ':')
        .replace(/ \{/g, '{')
        .replace(/\{ /g, '{')
        .replace(/\} /g, '}');
      module._compile(`module.exports=\`${css}\``, fn);
    });
};
module.exports = Module;
