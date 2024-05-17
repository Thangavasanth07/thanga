describe('Magic Link', () => {
  beforeEach(() => {
    // Clear JWT cookies & set all experiments to control
    cy.initializeExperiments()
  })
  it('invalid token redirects to login with query params', () => {
    //Magic link set to expire in 5 years - account: mark.rosenthal+cypress@flosports.tv
    cy.visit('/magic-link?redirect=%2Fevents%2F6381921-2019-beat-the-streets%2Fvideos%3Fplaying%3D6479343&user_id=12096115&magic_token=A_BAD_TOKEN&timestamp=1784737490&utm_source=newsletter&utm_medium=email', { failOnStatusCode: false })
    cy.url().should('contains', `${Cypress.config().baseUrl}/login?redirect=%2Fevents%2F6381921-2019-beat-the-streets%2Fvideos%3Fplaying%3D6479343`)
    cy.url().should('contains', '%26utm_medium%3Demail')
    cy.url().should('contains', '%26utm_source%3Dnewsletter')
    cy.getCookie('jwt_token').should('not.exist')
    cy.getCookie('jwt_refresh_token').should('not.exist')
  })
  it('valid token redirects to redirect param', () => {
    cy.visit('/magic-link?redirect=%2Fevents%2F6381921-2019-beat-the-streets%2Fvideos%3Fplaying%3D6479343&user_id=12096115&magic_token=f718423daa15842d42a6d40d8a1fb3032e6b49fedb37f6404d319ee6eff2265d&timestamp=1784737490&utm_source=newsletter&utm_medium=email', { failOnStatusCode: false })
    cy.url().should('contains', `${Cypress.config().baseUrl}/events/6381921-2019-beat-the-streets/videos?playing=6479343`)
    cy.url().should('contains', '&utm_medium=email')
    cy.url().should('contains', '&utm_source=newsletter')
    cy.getCookie('jwt_token').should('exist')
    cy.getCookie('jwt_refresh_token').should('exist')
  })
})
