describe('Events List UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('when a user loads /events', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/events')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/events')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load events list page content', () => {
      cy.cyGet('schedule-title')
      cy.cyGet('search-box')
      cy.cyGet('filters')
      cy.cyGet('date-bar')
      cy.cyGet('section-title')
      cy.cyGet('table-header')
    })
  })
})
