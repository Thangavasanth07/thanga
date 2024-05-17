describe('Search UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('When a user loads Search', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/search')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/search')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load search page content', () => {
      cy.cyGet('search-title')
      cy.cyGet('search-box')
      cy.cyGet('search-tabs-container')
      cy.cyGet('static-content-card')
      cy.cyGet('pagination')
      cy.cyGet('static-publish-date')
      cy.cyGet('static-description')
    })

    it('should have the all tab selected', () => {
      cy.cyGet('search-tab-item')
        .first()
        .should('have.class', 'tab-active')
    })

    it('should be the first page', () => {
      cy.get('.pagination .page-item')
        .first()
        .should('have.class', 'disabled')
      cy.get('.pagination .page-item')
        .eq(1)
        .should('have.class', 'active')
    })
  })
})
