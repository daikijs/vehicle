describe('Next', () => {

  beforeEach( () => {
    browser.get('/next');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-next h2')).getText()).toEqual('Features');
  });

});
