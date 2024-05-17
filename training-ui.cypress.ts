describe('Training UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('When a user loads /training', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/training')
      cy.wait('@segmentPageCall')
      cy.login()
    })

    it('should have proper url', () => {
      cy.url().should('include', '/training')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load training page content', () => {
      cy.cyGet('training-container')
      cy.cyGet('facet-container')
      cy.cyGet('search-title')
      cy.cyGet('search-container')
      cy.cyGet('search-count')
      cy.cyGet('subfacet-list')
      cy.cyGet('subfacet-title')
      cy.cyGet('facet-title')
      cy.cyGet('more')
      cy.cyGet('sort-by')
      cy.cyGet('video-container')
      cy.cyGet('spotlight-title')
      cy.cyGet('spotlight-footnote')
      cy.cyGet('thumbnail')
      cy.cyGet('result-see-more')
    })

    it('should play video', () => {
      cy.cyGet('spotlight-thumbnail').first().click()
      cy.url().should('include', '/training?playing')
      cy.cyGet("search-title")
      cy.cyGet("sort-by")
    })
  })
})
