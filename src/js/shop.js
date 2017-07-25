// shop client
const shop = {
  close: () => {
    document
      .getElementById('shop')
      .className += ' hide';
  },
  buy: () => {
    alert('coming soon');
  },
  add: comic => {
    comic = JSON.parse(comic);
    if (!comic)
      return;
    let cache;
    if (!localStorage.getItem('favorite'))
      localStorage.setItem('favorite', JSON.stringify([comic]))
    let session = JSON
      .parse(
        localStorage.getItem('favorite')
      );
    session
      .filter(item => item.title === comic.title)
      .map(item => cache = true);
    if (cache || session.length > 2)
      return;
    session.push(comic);
    localStorage.setItem('favorite', JSON.stringify(session));
  },
  favorite: () => {
    if (localStorage.getItem('favorite'))
      return JSON
        .parse(
          localStorage.getItem('favorite')
        );
    else
      return [];
  },
  remove: name => {
    if (!name)
      return;
    let session = JSON
      .parse(
        localStorage.getItem('favorite')
      );
    session = session
      .filter(item => {console.log(item.name !== name)})
    console.log(name)
    console.log(session)
    localStorage.setItem('favorite', JSON.stringify(session));
    return true;
  },
  preprocessor: comic => {
    console.log(comic);
    let thumbnail = comic.data.results[0].thumbnail;
    let title = comic.data.results[0].title;
    let page = comic.pageCount > 0 ?
      `<p>pages: ${comic.pageCount}</p>` :
      '';
    let print = comic.data.results[0].prices[0].price !== 0 ?
      `print ${comic.data.results[0].prices[0].price}$` :
      '';
    let digital = comic.data.results[0].prices.length > 1 ?
      `, digital ${comic.data.results[0].prices[1].price}$` :
      '';
    if (print === '')
      digital = digital.replace(/, /, '')
    let description = typeof comic.data.results[0].description === 'string' && comic.data.results[0].description.length > 0 ?
      `<p>${comic.data.results[0].description}</p>` :
      '';
    console.log(thumbnail);
    scrollTo(0, 0);
    document
      .getElementById('shop')
      .className = 'shop';
    document
      .getElementById('look')
      .src = `${thumbnail.path}.${thumbnail.extension}`;
    document
      .getElementById('add')
      .onclick = () => {
        shop.add(JSON.stringify(comic.data.results[0]));
      }
    document
      .getElementById('favorite')
      .onclick = () => {
        client.favorites();
      }
    document
      .getElementById('text')
      .innerHTML = `<h3>${title}</h3>
      price: ${print}${digital}
      ${page}
    `;
  },
  show: url => {
    console.log(`${url}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}`)
    fetch(`${url}?limit=10&ts=#{ts}&apikey=#{public}&hash=#{hash}`)
      .then(client.json)
      .then(shop.preprocessor)
      .catch(err => console.log(err));
  }
}
