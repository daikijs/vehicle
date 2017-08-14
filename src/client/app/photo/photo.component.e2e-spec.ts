describe('Photo', () => {

  beforeEach( () => {
    browser.get('/photo');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-photo h2')).getText()).toEqual('Features');
  });

});
