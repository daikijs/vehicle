describe('Help', () => {

  beforeEach( () => {
    browser.get('/help');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-help h2')).getText()).toEqual('Features');
  });

});
