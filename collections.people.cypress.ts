describe('Person Profile collection', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  before(() => {
    cy.clearCookies()
    cy.initializeExperiments()
    segmentPageCall()
  })

  /**
   * This is only valid for Gary Tonon on staging, see the visit url
   */
  it('Renders new grappling athlete tables', ()=> {
    const tableSectionTitles = [
      '2022',
      '2020',
      '2019',
      '2018',
      '2017',
      '2016',
      '2015',
      '2014',
      '2013',
      'W/L Methods',
      'Submission W/L Methods',
    ]

    cy.visit('/people/5947291-garry-tonon/result?flosite=flograppling')

    // Reload required to get experiment in proper state
    cy.reload()
    cy.wait('@segmentPageCall')

    cy.cyGet('section-table-component')
      .each((node, index, nodeList) => {
        // only execute once
        if (index === 0) cy.wrap(nodeList).should('have.length', 11)

        // execute on every iteration
        cy.wrap(node)
          .find('[data-test="section-title"]').should("contain.text", tableSectionTitles[index])
        cy.wrap(node)
          .get('[data-test="section-subtitle"]').should('exist')
        cy.wrap(node)
          .find('table > tbody > tr').should('have.length.at.least', 1)
      })
  })
})
