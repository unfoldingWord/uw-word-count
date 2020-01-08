describe('Word Count Basic Tests', function () {
  before(() => {
    cy.visit('/')
  })
  it('Should be at home page with README', function () {
    cy.get('.rsg--sectionName-12').should('have.text', 'README')
  })


  it('Should find 2 as frequency', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    cy.get('[data-testid=WordCountBasic-example-1] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > .MuiPaper-root > [style="overflow-x: auto;"] > :nth-child(1) > [style="overflow-y: auto;"] > .MuiTable-root > .MuiTableBody-root > [index="0"] > [value="2"]')
    .should('have.text','2')
  })

  it('Should find 58 words in Markdown text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    cy.get('[data-testid=WordCountBasic-example-5] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > .WordCountBasic-root-1 > :nth-child(1)')
    .should('have.text','58')
  })

  it('Should find 35 words in USFM text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    cy.get('[data-testid=WordCountBasic-example-7] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > .WordCountBasic-root-1 > :nth-child(1)').should('have.text','35')
  })

  it('Should find 565 words in UTN (column 8) text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    cy.get('[data-testid=WordCountBasic-example-9] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > .WordCountBasic-root-1 > :nth-child(1)')
    .should('have.text','565')
  })
})