describe('Standings UI', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentCall')
    cy.initializeExperiments()

  })

  it('Varsity Standings UI', () => {
    cy.visit(`/standings?flosite=varsity`)
    cy.wait('@segmentCall')

    cy.cyGet('standings-list-content')
    cy.cyGet('standings-list-content-header')
    cy.cyGet('standings-list-small-header')
     // cy.cyGet('standings-list-callout')
     // cy.cyGet('standings-list-table')
  })

  it('Varsity Standings View All UI', () => {
    cy.visit(`/standings/view-all?flosite=varsity`)
    cy.wait('@segmentCall')

    cy.cyGet('standings-list-content')
    cy.cyGet('standings-list-back-button')
    cy.cyGet('standings-list-small-header')
     // cy.cyGet('standings-list-callout')
     // cy.cyGet('standings-list-table')
  })

})

