describe('Live Player UI', () => {

  // TODO: Live Events are not LIVE from 19:00 to 7:00 CST
  // https://flocasts.atlassian.net/wiki/spaces/~niels.brunsgaard/pages/572522502/Permanent+test+streams
  const hour = new Date().getUTCHours()
  if (hour >= 0 && hour <= 12) {
    it.skip('Live Events are not LIVE from 19:00 to 7:00 CST', () => {
    })
    return
  }

  it('error messaging', () => {
    cy.intercept('POST', 'tokens/*/heartbeat', {statusCode: 409}).as('heartbeatService')
    cy.initializeExperiments()
    cy.login()
    cy.visit('/live/11708')
    cy.wait('@heartbeatService', { requestTimeout: 10000 }).its('response.statusCode').should('eq', 409)
    cy.cyGet('video-player-error-title')
  })
})
