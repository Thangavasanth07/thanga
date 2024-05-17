describe('Rankings UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('Rankings List Page', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/rankings')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/rankings')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load rankings list page content', () => {
      cy.cyGet('ranking-list-item')
      cy.cyGet('title')
      cy.cyGet('date')
      cy.cyGet('thumbnail')
      cy.cyGet('load-more')
    })
  })

  describe('Individual Ranking Page', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/rankings/6112000-automation-ranking-edit/27906-adfadf')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/rankings').and('include', '6112000')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load ranking page content', () => {
      cy.get('h1')
      cy.cyGet('ranking-container')
      cy.cyGet('content-author')
      cy.cyGet('small-subtitle')
      cy.cyGet('description')
      cy.cyGet('ranking-section')
      cy.cyGet('date-dropdown')
      cy.cyGet('ranking-content')
      cy.cyGet('right-rail')
    })
  })
})
