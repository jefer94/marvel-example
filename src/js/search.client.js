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
