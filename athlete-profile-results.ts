describe('Athlete Profile Results', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  beforeEach(() => {
    segmentPageCall()
    cy.initializeExperiments()
    cy.setExperimentToVariation('cxp_1521_new_athlete_profiles', 0)
  })

  it('Athlete Profile Results Page UI', () => {
    cy.visit(
      `/people/5950166-gordon-ryan?flosite=flograppling`
    )
    cy.wait('@segmentPageCall')
    cy.cyGet('navigation')
    cy.cyGet('footer')

    cy.cyGet('jumbotron')
    cy.cyGet('header-text').should('contain', 'Gordon Ryan')
    cy.cyGet('subheader-text').should('contain', '(W-L-D)')
    cy.cyGet('collection-favorite-button')
    cy.cyGet('tabs-container')

    cy.cyGet('tabs-container')
    cy.cyGet('table-header')
    cy.get('.tab-active').should('contain', 'Results')
    cy.get('.results-grappling-athlete')
      .should('contain', 'OPPONENT')
      .should('contain', 'REPLAY')
      .should('contain', 'METHOD')
      .should('contain', 'EVENT')
      .should('contain', 'WT.')
      .should('contain', 'DATE')
      .should('contain', 'W/L')
    cy.cyGet('row-0-table-cell-4-anchor').should('have.attr', 'href').and('include', '/people')
  })
})
