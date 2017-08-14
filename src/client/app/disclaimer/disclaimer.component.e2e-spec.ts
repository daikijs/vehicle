describe('Disclaimer', () => {

  beforeEach( () => {
    browser.get('/disclaimer');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-disclaimer h2')).getText()).toEqual('Features');
  });

});
