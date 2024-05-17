import 'cypress-wait-until'

describe('Standings', () => {

  /**
   * Query Tests
   */
  describe('When a user queries standings', () => {
    it('should update the facet dropdowns', () => {
      cy.visit(`https://staging-public.varsity.tv/standings`)
      cy.waitUntil(() => {
        return cy.cyGet('standings').should('be.visible').then(() => true)
      }, { timeout: 10000, interval: 1000 })
      cy.cyGet('scroll-container').should('exist')
    })

    it('should update the search box', () => {
      // Enter a search term and await the results
      cy.cyGet('search-input').first().click().safeType('test {enter}')
      cy.waitUntil(() => {
        return cy.cyGet('no-results-text').should('be.visible').then(() => true)
      }, { timeout: 10000, interval: 1000 })
      // Clicking clear search button should reset the search term to blank
      cy.cyGet('clear-search-btn').click({ force: true })
      cy.cyGet('search-input')
        .invoke('attr', 'placeholder')
        .should('contain', 'Search programs and teams')
    })
  })

  describe('When a user hits the view all link', () => {
    it('should update url with view-all', () => {
      cy.cyGet('clear-search-btn').click({ force: true })
      cy.cyGet('section-action-title').first().click({ force: true })
      cy.url().should('include', 'view-all')
    })
  })
})
