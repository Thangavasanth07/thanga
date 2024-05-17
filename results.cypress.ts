import 'cypress-wait-until'

describe('Results', () => {
  before(() => {
    cy.initializeExperiments()
    cy.visit('/results')
    cy.waitUntil(() => {
      return cy.cyGet('results-title').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
  })

  it('results page ui', () => {
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('copyright')
    cy.cyGet('footer-links')
    cy.cyGet('results-list-container')
    cy.cyGet('date-bar')
  })
})
