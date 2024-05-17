import 'cypress-wait-until'

beforeEach(() => {
  cy.initializeExperiments()
})

it('article paywall', () => {
  cy.visit('/articles/6489587-quick-takes-from-the-trials')
  cy.waitUntil(() => {
    return cy.get('flo-article-view').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.cyGet('paywall-button').first().click()
  cy.waitUntil(() => {
    return cy.cyGet('paywall-content-wrapper').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.url().should('include', 'signup')
})

it('event hub video paywall', () => {
  cy.visit('/events/6852914-flowrestling-burroughs-vs-taylor/videos?playing=6856910')
  cy.waitUntil(() => {
    return cy.get('.paywall').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.cyGet('paywall-button').first().click()
  cy.waitUntil(() => {
    return cy.cyGet('paywall-content-wrapper').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.url().should('include', 'signup')
})

it('video paywall', () => {
  cy.visit(
    '/video/6489370-86-lbs-rr-rnd-2-nicholas-heflin-titan-mercury-wrestling-club-tmwc-vs-pat-downey-titan-mercury-wrestling-club-tmwc'
  )
  cy.waitUntil(() => {
    return cy.get('.paywall').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.cyGet('paywall-button').first().click()
  cy.waitUntil(() => {
    return cy.cyGet('paywall-content-wrapper').should('be.visible').then(() => true)
  }, { timeout: 10000, interval: 1000 })
  cy.url().should('include', 'signup')
})

