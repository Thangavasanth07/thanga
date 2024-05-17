describe('Results List UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('when a user loads /results', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/results')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/results')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load results list page content', () => {
      cy.cyGet('results-list-container')
      cy.cyGet('search-box')
      cy.cyGet('date-bar')
    })
  })
})
