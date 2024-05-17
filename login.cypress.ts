import 'cypress-wait-until'

describe('Login from Homepage', () => {
  const postApiToken = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/api/tokens'
    }).as('apiTokens')
  }

  beforeEach(() => {
    cy.initializeExperiments()
    postApiToken()
    cy.visit('/')
    cy.waitUntil(() => {
      return cy.cyGet('headlines').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })

    cy.cyGet('flo-link')
      .contains('Log In')
      .click()

    // Login page
    cy.waitUntil(() => {
      return cy.cyGet('flo-logo').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.url().should('include', 'login')
  })

  it('FREE login', () => {
    cy.get('input[placeholder="Email Address"]').safeType('kodiak.furr+sanityqa@flocasts.com')
    cy.get('input[placeholder="Password"]').safeType('flo123')
    cy.get('.btn').click()
    cy.wait('@apiTokens')
    cy.url().should('include', 'plans')
  })

  it('PRO login', () => {
    cy.get('input[placeholder="Email Address"]').safeType('mark.rosenthal+cypress@flosports.tv')
    cy.get('input[placeholder="Password"]').safeType('Florocks123')
    cy.get('.btn').click()
    cy.wait('@apiTokens')
    cy.get('.plans-desktop-wrapper')
  })
})
