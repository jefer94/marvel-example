// client
const shop = function() {
  const close = () => {
    this.exit = this.exit ?
      this.exit :
      document.getElementById('shop');
    this.exit.className += ' hide';
  }
  const buy = () => {
    alert('coming soon');
  }
  const add = comic => {
    console.log(JSON.parse(comic))
    if (!comic)
      return;
    comic = JSON.parse(comic);
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
  }
  const favorite = () => {
    if (localStorage.getItem('favorite'))
      return JSON
        .parse(
          localStorage.getItem('favorite')
        );
    else
      return [];
  }
  const remove = name => {
    if (!name)
      return;
    let session = JSON
      .parse(
        localStorage.getItem('favorite')
      );
    session = session
      .filter(item => {
        return item.title !== name
      });
    localStorage.setItem('favorite', JSON.stringify(session));
    client.favorites();
    return true;
  }
  return {
    add      : add,
    close    : close,
    remove   : remove,
    buy      : buy,
    favorite : favorite
  }
}()
