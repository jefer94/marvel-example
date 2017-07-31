// singleton objectoutput 
const render = function() {
  const set = (output, instance) => {
    // check arguments
    if (!output || !instance)
      return;
    // memoization
    this.results           = this.results  || document.getElementById('renders');
    this.instance          = this.instance || 'result';
    this.results.innerHTML = '';
    this.results.innerHTML = output;

    // center errors
    if (this.instance !== instance) {
      if (instance === 'err') {
        this.instance          = 'err';
        this.results.className = 'results error';
      }
      else if (instance === 'result') {
        this.instance          = 'result';
        this.results.className = 'results';
      }
    }
    // stop load animation
    load(false);
  }
  // order description
  const order = list => {
    if (!list)
      return;
    if (!(list instanceof Array))
     throw 'input to render is invalid';
    // filter with description
    let with_description = list
      .filter(value => value.description !== '');
    // filter without description
    let without_description = list
      .filter(value => value.description === '');
    // order characters
    return list = with_description
      .concat(without_description);
  }
  // description
  const description = text => {
    text = text ?
      text :
      '';
    if (text && text.length >= 463) {
      let lexical = [',', '.', ';', ':'];
      text        = text
        .substr(0, 463)
        .split('');
      let letter  = text.pop();
      while (letter) {
        letter    = text.pop();
      }
      letter      = text.pop();
      let result  = lexical
        .filter(char => char === letter);
      if (result.length)
        text.push(letter);
      return `${text.join()}...`;
    }
    else
      return text;
  }
  // characters
  const characters = list => {
    if (!list)
      return;
    // generate 
    let result = order(list).map((comic) =>
      `
        <a class='card' onclick='client.get("${comic.name}", "${comic.id}")'>
          <img src='${comic.thumbnail}'/>
          <h3>${comic.name}</h3>
          <p>${description(comic.description)}</p>
        </a>
      `
    );
    set(result.join(), 'result');
  }
  // comics
  const comics = list => {
    if (!list)
      return;
    // generate 
    let result = order(list).map((comic) =>
      `
        <a class='card' onclick='client.store("${comic.id}")'>
          <img src='${comic.thumbnail}'/>
          <h3>${comic.title}</h3>
          <p>${description(comic.description)}</p>
          <p>prices: ${comic.print}${comic.digital}</p>
          <p>pages: ${comic.pages}</p>
        </a>
      `
    );
    set(result.join(), 'result');
  }
  // favorites
  const favorites = list => {
    if (!list)
      return;
    // generate 
    let result = order(list).map(comic =>
      `
        <a class='card' onclick='shop.show("${comic.resourceURI}")'>
          <img src='${comic.thumbnail}'/>
          <h3>${comic.title}</h3>
          <p>${description(comic.description)}</p>
          <bottom class='delete' onclick='shop.remove(\`${comic.title}\`)'>delete</bottom>
        </a>
      `
    );
    set(result.join(), 'result');
  }
  // error 404
  let e404 = err => {
    // check arguments
    if (!err)
      return;
    err = err
      .replace(/%20/g, ' ');
    set(`<h1>${err}</h1>`, 'err');
  }
  // on load element
  const load = is_active => {
    this.load = this.load ?
      this.load :
      document.getElementById('load');
    if (is_active) {
      // list of colors
      this.colors = this.colors ? 
        this.colors :
        [
          // red
          '#EF5350',
          // orange
          '#FF9800',
          // amber
          '#FFC107',
        ];
      let index = 0;
      let speed = 1;
      this.loop = setInterval(() => {
        if (index === 0)
          speed = 1;
        else if (index === this.colors.length - 1)
          speed = -1;
        this.load.style = `background-color: ${this.colors[index]}; display: block`;
        index += speed;
      }, 800);
    }
    else {
      clearInterval(this.loop);
      this.load.style = '';
    }
  }
  // shop
  const shop = comic => {
    render.load();
    console.log(comic)
    // memoization
    this.shop     = this.shop ?
      this.shop     :
      document.getElementById('shop');
    this.look     = this.look ?
      this.look     :
      document.getElementById('look');
    this.add      = this.add ?
      this.add      :
      document.getElementById('add');
    this.favorite = this.favorite ?
      this.favorite :
      document.getElementById('favorite');
    this.text     = this.text ?
      this.text     :
      document.getElementById('text');

    window.comic        = JSON.stringify(comic[0]);
    this.shop.className = 'shop';
    this.look.src       = `${comic[0].thumbnail}`;
    this.add.setAttribute('onclick', 'shop.add(window.comic)');
    this.favorite.setAttribute('onclick', 'client.favorites()');
    this.text.innerHTML = `
      <h3>${comic[0].title}</h3>
      <p>prices: ${comic[0].print}${comic[0].digital}</p>
      <p>pages: ${comic[0].pages}</p>
    `;
  }
  // public interface
  return {
    load       : load,
    e404       : e404,
    characters : characters,
    comics     : comics,
    favorites  : favorites,
    shop       : shop
  }
}();
