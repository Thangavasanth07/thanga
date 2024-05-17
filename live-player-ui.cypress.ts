import 'cypress-wait-until'

describe('Live Player UI', () => {

    // TODO: Live Events are not LIVE from 19:00 to 7:00 CST
    // https://flocasts.atlassian.net/wiki/spaces/~niels.brunsgaard/pages/572522502/Permanent+test+streams
    const hour = new Date().getUTCHours()
    if (hour >= 0 && hour <= 12) {
      it.skip('Live Events are not LIVE from 19:00 to 7:00 CST', () => {
      })
      return
    }

  before(() => {
    cy.initializeExperiments()
    cy.login()
    cy.visit('/live/11708')
  })

  it('page ui', () => {
    cy.waitUntil(() => {
      return cy.cyGet('bottom-container').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.get('.wrp')
    cy.cyGet('bottom-container')
    cy.cyGet('video-control-header')
    cy.cyGet('center-grid')
    cy.cyGet('header-title')
    cy.cyGet('stream-container')
    cy.cyGet('stream-thumb')
    cy.cyGet('stream-playing-svg')
    cy.cyGet('multi-view')
    cy.cyGet('video-controls')
    cy.cyGet('live-quality')
    cy.cyGet('live-volume-control')
    cy.cyGet('live-video-fullscreen')
    cy.cyGet('stream-tabs-container')
    cy.cyGet('stream-tabs').contains('schedule').click()
    cy.cyGet('stream-tabs').contains('replays').click()
    cy.cyGet('thumbnail')
    cy.cyGet('spotlight-title')
    cy.cyGet('pro')
    cy.cyGet('spotlight-footnote')
    cy.cyGet('right-rail-fab')
    cy.cyGet('badge')
    cy.cyGet('right-rail-event-title')
    cy.cyGet('event-right-rail')
    cy.cyGet('upcoming')
  })
})
