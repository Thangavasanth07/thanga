describe('Films UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('When a user loads /films', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/films')
      cy.wait('@segmentPageCall')
      cy.login()
    })

    it('should have proper url', () => {
      cy.url().should('include', '/films')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load films page content', () => {
      cy.cyGet('film-container')
      cy.cyGet('search-box')
      cy.cyGet('see-more')
      cy.cyGet('film-header')
      cy.cyGet('thumbnail')
      cy.cyGet('spotlight-title')
      cy.cyGet('spotlight-footnote')
      cy.cyGet('pro')
    })

    it('should play video', () => {
      cy.cyGet('spotlight-title').first().click()
      cy.url().should('include', '/films?playing')
      cy.cyGet('vid-controls')
      cy.cyGet('film-title')
      cy.cyGet('film-date')
      cy.cyGet('film-description')
      cy.cyGet('film-container')
      cy.cyGet('description-container')
    })
  })
})
