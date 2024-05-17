import 'cypress-wait-until'

describe('Home page', () => {

  it('ui', () => {
    cy.initializeExperiments()
    cy.visit('/')
    cy.waitUntil(() => {
      return cy.cyGet('headlines').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })

    // Standard navbar
    cy.cyGet('navigation')
    cy.cyGet('event-ticker')
    cy.cyGet('event-status')
    cy.cyGet('event-ticker-title')
    cy.get('.site-navigation-header-container')
    cy.cyGet('hamburger-icon')
    cy.cyGet('flo-logo')
    cy.cyGet('flo-link')
    cy.cyGet('flo-link').should('contain', 'Log In')
    cy.cyGet('flo-link').should('contain', 'Watch')
    cy.cyGet('flo-link').should('contain', 'Search')
    cy.cyGet('flo-link').should('contain', 'SIGN UP')
    cy.cyGet('footer-links')
    // Next-Gen Homepage
    cy.cyGet('quick-links')
    cy.cyGet('headlines')
    cy.cyGet('main-hero')
    cy.cyGet('main-banners')
    cy.cyGet('event-ticker')
  })
  it('should display SIGN UP button if user is logged with no subscription', () => {
    cy.initializeExperiments()
    cy.createNewUserAndLogin()
    cy.visit('/')
    cy.waitUntil(() => {
      return cy.cyGet('headlines').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('flo-link').should('contain', 'SIGN UP')
  })
})
