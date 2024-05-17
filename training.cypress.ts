describe('Training', () => {
  const pageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  beforeEach(() => {
    cy.initializeExperiments()
  })

  it('Facets', () => {
    pageCall()
    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/legacy-core/search'
    }).as('getSearch')

    cy.visit('/training')
    cy.wait('@segmentPageCall')

    cy.cyGet('subfacet-title')
      .first()
      .click()
    cy.cyGet('clear-facets')
      .trigger('mouseover').click({ force: true })
    cy.cyGet('subfacet-title')
      .each(element => expect(element).not.have.class('primary-color-text'))
    cy.cyGet('result-see-more')
      .trigger('mouseover').click({ force: true })
    cy.wait('@getSearch')

    cy.cyGet('subfacet-title')
      .its('length').should('be.gte', 12)
  })

  it('PRO user loads video', () => {
    pageCall()
    cy.login()
    cy.visit('/training?playing=6102729')
    cy.wait('@segmentPageCall')

    cy.cyGet('paywall-button')
      .should('not.exist')
  })

  it('Logged-out user loads video', () => {
    pageCall()
    cy.logout()
    cy.visit('/training?playing=6102729')
    cy.wait('@segmentPageCall')

    cy.cyGet('paywall-button')
  })
})
