describe('Damage', () => {

  beforeEach( () => {
    browser.get('/damage');
  });

  it('should have correct feature heading', () => {
    expect(element(by.css('sd-damage h2')).getText()).toEqual('Features');
  });

});
