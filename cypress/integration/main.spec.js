describe('My First Test', function () {
  before(() => {
    cy.visit('/')
  })
  it('Does not do much!', function () {
    expect(true).to.equal(true)
  })
})