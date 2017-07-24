// if browser is resize then search bar is resize
window.onresize = () => {
  const navbar_padding    = 20 * 2;
  const logo_width        = 160 + navbar_padding;
  const navbar            = document.getElementById('navbar');
  const navbar_width      = navbar.offsetWidth;
  const logo_porcentage   = ( logo_width * 100 ) / navbar_width;
  const search_porcentage = 100 - logo_porcentage - 4;
  const search            = document.getElementById('search');
  search.style.width      = `${search_porcentage}%`;
}
window.onresize();
const client = {
  // json response
  json: response => {
    var contentType = response.headers.get("content-type");
    if(contentType && contentType.includes("application/json")) {
      return response.json();
    }
  },
  // get comics
  comics: result => {
    result.data.results.map(comic => {
      if (comic.pageCount === 0) return;
      let digital = comic.prices.length > 1 ?
        `, digital ${comic.prices[1].price}` :
        '';
      let description = comic.description ?
        `<p>${comic.description}</p>` :
        '';
      console.log(comic);
      results.innerHTML += `<div class='card'>
          <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
          <h3>title: ${comic.title}</h3>
          ${description}
          <p>prices: print ${comic.prices[0].price}${digital}</p>
          <p>pages: ${comic.pageCount}</p>
        </div>
      `;
    })
  },
  // error 404
  e404: (result, results, comics) => {
    if (result.data.count === 0) {
      comics = comics.replace(/&name=/, '');
      results.innerHTML += `<h1 style='text-align=\'center\''>can not find ${comics}</h1>`;
      return;
    }
  },
  // home
  home: (result, results, comics) => {
    if (comics === '') {
      result.data.results.map(comic => {
        location.hash = `#!/${comics}`;
        console.log(comic);
        /*
        let related = '';
        if (comic.comics.items.length > 0) {
          related += `<h4>related comics</h4>`;
          comic.comics.items.map(element => {
            related += `<p>${element.name}</p>`;
          });
        }
        */
        results.innerHTML += `<a class='card' onclick='get_character("${comic.name}")'>
          <img src='${comic.thumbnail.path}.${comic.thumbnail.extension}'/>
            <h3>${comic.name}</h3>
            <p>${comic.description}</p>
          </a>
        `;
      })
    }
  },
  // products
  product: (result, results, comics) => {
    if (comics !== '') {
      result.data.results.map(comic => {
        var results = document.getElementById('results');
        results.innerHTML = '';
        comic.comics.items.map(item => {
          fetch(`${item.resourceURI}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}`)
            .then(client.json)
            .then(client.comics);
        });
        location.hash = `#!/${comics}`;
      })
    }
  },
  get: (character, page) => {
    // number of results it will be omitting
    var offset = page ?
      `offset=${page * 10}` :
      '';
    // find a character
    var comics  = character ?
      `&name=${character}` :
      location.hash !== '' && location.hash !== '#!/' ?
        `&name=${location.hash.replace(/#!\//, '')}` :
        '';
    var results = document.getElementById('results');
    results.innerHTML = '';
    // consult marvel api rest
    fetch(`http://gateway.marvel.com:80/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}${comics}${offset}`)
      .then(client.json)
      .then(result => {
        comics = comics.replace(/&name=/, '');
        client.e404(result, results, comics);
        client.home(result, results, comics);
        client.product(result, results, comics);
      })
  }
}
// consult marvel api rest, render various characters if the parameter
// character is empty else render various comics by character
document
  .getElementById('search')
  .onkeypress = (e) => {
    if (e.keyCode == 13) {
      let value = document.getElementById('search').value;
      client.value(value);
      return false;
    }
  }
window.onhashchange = client.get();
