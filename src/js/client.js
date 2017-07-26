// marvel client
const client = {
  // json response
  json: response => {
    var contentType = response.headers.get('content-type');
    if(contentType && contentType.includes('application/json')) {
      return response.json();
    }
  },
  show: comic => {
    let page = comic.pageCount > 0 ?
      `<p>pages: ${comic.pageCount}</p>` :
      '';
    let print = comic.prices[0].price !== 0 ?
      `print ${comic.prices[0].price}` :
      '';
    let digital = comic.prices.length > 1 ?
      `, digital ${comic.prices[1].price}` :
      '';
    if (print === '')
      digital = digital.replace(/, /, '')
    let description = typeof comic.description === 'string' && comic.description.length > 0 ?
      `<p>${comic.description}</p>` :
      '';
    console.log(comic);
    // console.log(comic);
    if (description !== '')
      results.innerHTML = `<a class='card' onclick='shop.show("${comic.resourceURI}")'>
          <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
          <h3>title: ${comic.title}</h3>
          ${description}
          <p>prices: ${print}${digital}</p>
          ${page}
        </a>
      ${results.innerHTML}`;
    else
      results.innerHTML = `${results.innerHTML}
        <a class='card' onclick='shop.show("${comic.resourceURI}")'>
          <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
          <h3>title: ${comic.title}</h3>
          ${description}
          <p>prices: ${print}${digital}</p>
          ${page}
        </a>`;
  },
  comics: result => {
    // console.log(result);
    if (result.data.results.length > 0) {
      characters = result.data.results;
      characters
        .map(client.show);
    }
  },
  // error 404
  e404: (result, results, comics) => {
    if (result.data.count === 0) {
      comics = comics.replace(/&name=/, '');
      results.innerHTML += `<h1 style='text-align=\'center\''>can not find ${comics}</h1>`;
      return;
    }
  },
  // show characters in home
  start: comic => {
    // console.log(comic);
    results.innerHTML += `<a class='card' onclick='client.get("${comic.name}")'>
      <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
        <h3>${comic.name}</h3>
        <p>${comic.description}</p>
      </a>
    `;
  },
  // home
  home: (result, results, comics) => {
    if (comics === '') {
      let characters = result.data.results;
      location.hash = `#!/${comics}`;
      characters
        .filter(comic => comic.description !== '')
        .map(client.start);

      characters
        .filter(comic => comic.description === '')
        .map(client.start);
    }
  },
  // products
  product: (result, results, comics, offset) => {
    if (comics !== '') {
      if (result.data.results.length > 0) {
        result.data.results.map(comic => {
          var results = document.getElementById('results');
          results.innerHTML = '';

          if (comic.comics.items.length > 0)
            comic.comics.items.map(item => {
              console.log('some')
              fetch(`${item.resourceURI}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}${offset}`)
                .then(client.json)
                .then(client.comics)
                .catch(err => console.log(err));
            });
          else {
            var results = document.getElementById('results');
            // console.log(results);
            results.innerHTML = `<h1 style='text-align=\'center\''>${comics} does not have any comics</h1>`;
          }
          location.hash = `#!/${comics}`;
        })
      }
    }
  },
  favorites: () => {
    var results = document.getElementById('results');
    results.innerHTML = '';
    if (shop.favorite().length > 0) {
      shop
        .favorite()
        .map(comic => {
          let page = comic.pageCount > 0 ?
            `<p>pages: ${comic.pageCount}</p>` :
            '';
          let print = comic.prices[0].price !== 0 ?
            `print ${comic.prices[0].price}` :
            '';
          let digital = comic.prices.length > 1 ?
            `, digital ${comic.prices[1].price}` :
            '';
          if (print === '')
            digital = digital.replace(/, /, '')
          let description = typeof comic.description === 'string' && comic.description.length > 0 ?
            `<p>${comic.description}</p>` :
            '';
          results.innerHTML += `<a class='card'>
              <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
              <h3>title: ${comic.title}</h3>
              ${description}
              <p>prices: ${print}${digital}</p>
              ${page}
              <bottom class='delete' onclick='shop.remove(\`${comic.title}\`)'>delete</bottom>
            </a>
          `;
        });
    }
    else
      results.innerHTML = `<h1 style='text-align=\'center\''>not have any comic favorite</h1>`;
    location.hash = '#!/favorites';
  },
  get: (character, page) => {
    // number of results it will be omitting
    var offset = page ?
      `offset=${page * 10}` :
      '';
    // find a character
    var comics  = character ?
      `&name=${character}` :
      location.hash !== '' && location.hash !== '#!/' && character !== '' ?
        `&name=${location.hash.replace(/#!\//, '')}` :
        '';
    var results = document.getElementById('results');
    results.innerHTML = '';
    // consult marvel api rest
    // console.log(`http://gateway.marvel.com:80/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}${comics}${offset}`)
    fetch(`http://gateway.marvel.com:80/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}${comics}${offset}`)
      .then(client.json)
      .then(result => {
        comics = comics.replace(/&name=/, '');
        if (comics === 'favorites') {
          client.favorites();
          return;
        }
        client.e404(result, results, comics);
        client.home(result, results, comics);
        client.product(result, results, comics, offset);
      })
      .catch(err => console.log(err));
  }
}
