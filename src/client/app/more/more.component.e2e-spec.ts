describe('More', () => {

  beforeEach( () => {
    browser.get('/more');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-more h2')).getText()).toEqual('Features');
  });

});
