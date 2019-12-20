describe('Word Count Tests', function () {
  before(() => {
    cy.visit('/')
  })
  it('Should be at home page with README', function () {
    cy.get('.rsg--sectionName-12').should('have.text', 'README')
  })


  it('Should find 2 as frequency', function() {
    // in text: to be or not to be, the word "to" occurs twice

    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    // second, locate the word
    cy.get(':nth-child(3) > [style="overflow-x: auto;"] > :nth-child(1) > [style="overflow-y: auto;"] > .MuiTable-root > .MuiTableBody-root > [index="1"] > [value="be"]')
    .should('have.text','be')
    // third, locate the frequency
    cy.get('[data-testid=WordCountBasic-example-1] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > :nth-child(3) > [style="overflow-x: auto;"] > :nth-child(1) > [style="overflow-y: auto;"] > .MuiTable-root > .MuiTableBody-root > [index="1"] > [value="2"]')
    .should('have.text','2')
  })

  it('Should find 58 words in Markdown text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    // get the text from the pagination, looking for 
    cy.get('[data-testid=WordCountBasic-example-3] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > :nth-child(2) > :nth-child(3) > .MuiTableFooter-root > .MuiTableRow-root > .MuiTableCell-root > .MuiToolbar-root > .MTablePaginationInner-root-204 > .MuiTypography-root')
    .should('have.text','1-5 of 58')
  })

  it('Should find 35 words in USFM text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    // get the text from the pagination, looking for 
    cy.get('[data-testid=WordCountBasic-example-5] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > :nth-child(2) > :nth-child(3) > .MuiTableFooter-root > .MuiTableRow-root > .MuiTableCell-root > .MuiToolbar-root > .MTablePaginationInner-root-204 > .MuiTypography-root'
    )
    .should('have.text','1-5 of 35')
  })

  it('Should find 565 words in UTN (column 8) text', function() {
    // first click to the WordCountBasic component
    cy.get(':nth-child(2) > .rsg--list-54 > .rsg--item-55 > .rsg--link-25')
    .click()

    // get the text from the pagination, looking for 
    cy.get('[data-testid=WordCountBasic-example-7] > .rsg--preview-42 > :nth-child(1) > .MuiPaper-elevation1 > :nth-child(2) > :nth-child(3) > .MuiTableFooter-root > .MuiTableRow-root > .MuiTableCell-root > .MuiToolbar-root > .MTablePaginationInner-root-204 > .MuiTypography-root'
    )
    .should('have.text','1-5 of 565')
  })
})