describe('shop', (done) => {
  describe('#favorite()', () => {
    it('should return a array empty', () => {
      assert(shop.favorite().length === [].length);
      return done;
    })
  })
  describe('#add()', () => {
    it('should return undefined if parameter is empty', () => {
      assert(shop.add() === undefined);
    })
  })
  describe('#favorite()', () => {
    it('should return []', () => {
      assert(shop.favorite().length === 0);
    })
  })
  describe('#add(comic)', () => {
    it('should return []', () => {
      assert(shop.add({title: 'Example', example: '1'}) === undefined);
    })
  })
  describe('#favorite()', () => {
    it('should return a array', () => {
      assert(shop.favorite().length === 1);
    })
  })
  describe('#remove()', () => {
    it('should return undefined', () => {
      assert(shop.remove() === undefined);
    })
  })
  describe('#favorite()', () => {
    it('should return a array', () => {
      assert(shop.favorite().length === 1);
    })
  })
  describe('#remove(comic)', () => {
    it('should return true', () => {
      assert(shop.remove('Example') === true);
    })
  })
  describe('#favorite()', () => {
    it('should return []', () => {
      assert(shop.favorite().length === 0);
    })
  })
})
