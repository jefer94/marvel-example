// marvel client
const client = function() {
  // json response
  const json = response => {
    var contentType = response.headers.get('content-type');
    if(contentType && contentType.includes('application/json')) {
      return response.json();
    }
  }
  const show = comic => {
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
  }
  // comics
  let comics = (name, id, offset) => {
    // memoization
    const args = JSON.stringify({
      id: id,
      name: name,
      offset: offset
    });
    this.args = this.args || [];
    if (this.args[args]) {
      if (this.args[args].length)
        render.comics(this.args[args]);
      else
        render.e404('can not find any comic');
      return;
    }
    offset = offset ?
      +offset * 10 :
      0;
    // console.log(`http://gateway.marvel.com/v1/public/characters/${id}/comics?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&offset=${offset}`);
    fetch(`http://gateway.marvel.com/v1/public/characters/${id}/comics?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&offset=${offset}`)
      .then(json)
      .then(characters => {
        render.load();
        location.hash = `#!/${name}`;
        // console.log(characters)
        if (characters.data.count > 0) {
          let response = characters.data.results
            .map(comic => {
              // generate a array
              return {
                id          : comic.id,
                title       : comic.title,
                resourceURI : comic.resourceURI,
                description : comic.description,
                thumbnail   : `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
                pages       : comic.pageCount,
                print       : comic.prices[0].price,
                digital     : comic.prices[1] ?
                  comic.prices[1].price :
                  0
              };
            })
          this.args[args] = response;
          render.comics(response);
        }
        else {
          this.args[args] = [];
          render.e404('can not find any comic');
        }
      })
      .catch(console.error);
      // render.comics(results);
  }

  // error 404
  let e404 = (elements, title) => {
    if (elements === 0) {
      title = title.replace(/&name=/, '');
      render.e404(`can not find ${title}`);
    }
  }
  // home
  let home = offset => {
    // memoization
    const args = JSON.stringify({
      offset: offset
    });
    this.args = this.args || [];
    if (this.args[args]) {
      if (this.args[args].length)
        render.characters(this.args[args]);
      else
        render.e404('error 404 in home');
      return;
    }
    offset = offset ?
      +offset * 10 :
      0;
    // console.log(`http://gateway.marvel.com/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&offset=${offset}`);
    fetch(`http://gateway.marvel.com/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&offset=${offset}`)
      .then(json)
      .then(characters => {
        render.load();
        location.hash = `#!/`;
        let response = characters.data.results
          .map(value => {
            // generate a array
            return {
              id: value.id,
              name: value.name,
              description: value.description,
              thumbnail: `${value.thumbnail.path}.${value.thumbnail.extension}`
            }
          })
        this.args[args] = response;
        render.characters(response);
      })
      .catch(console.error);
  }
  // favorites
  let favorites = () => {
    shop.close();
    var results = document.getElementById('results');
    results.innerHTML = '';
    if (shop.favorite().length > 0) {
      const result = shop
        .favorite()
        .map(comic => {
          return {
            id: comic.id,
            title: comic.title,
            description: comic.description,
            thumbnail: `${comic.thumbnail}`
          }
        });
      render.favorites(result);
    }
    else
      render.e404('not have any comic favorite');
    render.load();
    location.hash = '#!/favorites';
  }
  const search = (character, offset) => {
    // memoization
    const args = JSON.stringify({
      character: character,
      offset: offset
    });
    this.args = this.args || [];
    if (!isNaN(this.args[args])) {
      if (this.args[args] !== 0) {
        comics(character, this.args[args], offset);
      }
      else
        render.e404(`can not find ${character}`);
      return;
    }
    // console.log(`http://gateway.marvel.com/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&name=${character}`);
    fetch(`http://gateway.marvel.com/v1/public/characters?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}&name=${character}`)
      .then(json)
      .then(result => {
        if (result.data.count) {
          const comic = result.data.results[0];
          this.args[args] = comic.id;
          comics(comic.name, comic.id, offset)
        }
        else {
          this.args[args] = 0;
          render.e404(`can not find ${character}`);
        }
      })
      .catch(console.error);
  }
  // shop
  const store = id => {
    // memoization
    const args = JSON.stringify({
      id: id
    });
    this.args = this.args || [];
    if (!isNaN(this.args[args])) {
      if (this.args[args] !== 0) {
        render.shop(this.args[args]);
      }
      else
        render.e404(`can not find this comic`);
      return;
    }
    render.load(true);
    // console.log(`http://gateway.marvel.com/v1/public/comics/${id}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}`);
    fetch(`http://gateway.marvel.com/v1/public/comics/${id}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}`)
      .then(json)
      .then(favorites => {
        if (favorites.data.count > 0) {
          let response = favorites.data.results
            .map(comic => {
              // generate a array
              return {
                title: comic.title,
                resourceURI: comic.resourceURI,
                description: comic.description,
                thumbnail: `${comic.thumbnail.path}.${comic.thumbnail.extension}`,
                pages: comic.pageCount,
                print: comic.prices[0].price,
                digital: comic.prices[1] ?
                  comic.prices[1].price :
                  0
              };
            })
          this.args[args] = response;
          render.shop(response);
        }
        else {
          this.args[args] = [];
          render.e404('can not find this comic');
        }
      })
      .catch(console.error);
  }
  const get = (character, page_or_id, page) => {
    render.load(true);
    const offset = page ?
      page :
      page_or_id < 100 ?
        page_or_id :
        0;
    const id = page ?
      page :
      page_or_id;
    character = typeof character === 'string' ?
      character :
      location.hash.replace(/#!\//, '');

    if (character) {
      if (character === ''/* || character === location.hash.replace(/#!\//, '')**/) {
        location.hash = '#!/'
        console.log('here')
        home(offset);
      }
      else if (character === 'favorites') {
        location.hash = '#!/favorites'
        favorites();
      }
      else if (!id) {
        location.hash = `#!/${character}`
        search(character, offset);
      }
      else {
        location.hash = `#!/${character}`
        comics(character, id, offset);
      }
    }
    else {
      location.hash = '#!/'
      home(offset);
    }
  }
  return {
    favorites : favorites,
    store     : store,
    json      : json,
    get       : get
  }
}()
