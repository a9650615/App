describe('Example', () => {
  it('should have screen', async () => {
    // await device.reloadReactNative()
    await expect(element(by.id('router'))).toBeVisible()
    await element(by.id('LoginBtn')).tap()
    // await expect(element(by.id('asdasfw'))).toBeVisible()
  })
})