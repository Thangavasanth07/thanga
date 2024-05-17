/**
 * MileSplit streams do not necessarily provide all the data that other verticals provide.
 *    ex: cms event id -- ms live events are not necessarily tied to a "Flo" live event.
 *
 * This has made the resolver/guard/component break in the past and go 404, without us noticing.
 *    See: https://flocasts.atlassian.net/wiki/spaces/ENG/pages/3014262851/2021-08-27+MileSplit+URLs+to+Live+Events
 *
 * The purpose of this test is to ensure the page, player, and UI loads for a milesplit stream. It does not matter
 * whether this event is actually "live" at the time.
 *
 * We can test this on any vertical, we do not need to be in accounts.milesplit.com -- flodogs will load it.
 */


describe('MileSplit Live Player Loads', () => {

  before(() => {
    cy.initializeExperiments()
    cy.setExperimentToControl('cxp_2618_feat_pricing_arch')
    cy.login()
    cy.visit('/live/9639')
  })

  it('page ui', () => {
    cy.get('.wrp') // Wrapper for the entire player
    cy.cyGet('bottom-container')
    cy.cyGet('video-control-header')
    cy.cyGet('center-grid')
    cy.cyGet('header-title')
    cy.cyGet('stream-container')
    cy.cyGet('multi-view')
    cy.cyGet('video-controls')
    cy.cyGet('live-quality')
    cy.cyGet('live-volume-control')
    cy.cyGet('live-video-fullscreen')
    cy.cyGet('event-right-rail')
    cy.cyGet('upcoming')

    cy
      .get('.heading-event-title')
      .contains('KARL-MILESPLIT-TEST')
  })
})
