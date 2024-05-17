import 'cypress-wait-until'

describe('Event Hub UI', () => {

  before (() => {
    cy.initializeExperiments()
  })

  it('should load event hub', () => {
    cy.visit('/events/6264536-2019-snow-bros')
    cy.waitUntil(() => {
      return cy.cyGet('entity-hub-main-content').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.url().should('include', '/events').and('include', '6264536')
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('header')
    cy.cyGet('header-title-desktop')
    cy.cyGet('header-summary')
    cy.cyGet('sub-navigation')
    cy.cyGet('entity-hub-main-content')
    cy.cyGet('right-rail')
    cy.cyGet('description')
    cy.get('flo-image-with-buttons').should('exist')
  })
})


