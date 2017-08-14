describe('Estimate', () => {

  beforeEach( () => {
    browser.get('/estimate');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-estimate h2')).getText()).toEqual('Features');
  });

});
