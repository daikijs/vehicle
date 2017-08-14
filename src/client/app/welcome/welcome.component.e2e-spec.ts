describe('Welcome', () => {

  beforeEach( () => {
    browser.get('/welcome');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-welcome h2')).getText()).toEqual('Features');
  });

});
