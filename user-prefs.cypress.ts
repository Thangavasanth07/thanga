describe('User Prefs', () => {
  const setupSpies = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/t'
    }).as('apiSegmentTrack')

    cy.intercept({
      method: 'POST',
      pathname: '/*/user-customizations'
    }).as('apiPostCustomization')

    cy.intercept({
      method: 'DELETE',
      pathname: '/*/user-customizations/*'
    }).as('apiDeleteCustomization')

    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  beforeEach(() => {
    cy.initializeExperiments()
    setupSpies()
  })

  it('thank you to favorites', () => {
    // Existing premium user on thank you page
    cy.login()
    cy.visit('/thank-you?flosite=floracing')

    cy.wait('@segmentPageCall')

    cy.cyGet('add-favorites-button')
      .click()

    cy.wait('@segmentPageCall')

    cy.location('href').should('include', '/choose-favorites')
    cy.cyGet('steps-header')
    cy.get('.favorites-list')
  })

  it('favorites UI', () => {
    cy.createNewUserAndLogin()
    cy.visit('/account/choose-favorites?flosite=floracing')

    cy.wait('@segmentPageCall')

    cy.get('.favorites-list')
    cy.cyGet('checkout-header-wrapper')
    cy.get('.page-header')
    cy.get('.fav-grid-container')
    cy.cyGet('button-secondary')
    cy.get('.favorite-placeholder__container')
    cy.cyGet('button-primary')

    // Functionality
    // Add one
    cy.cyGet('avatar-container__border')
      .first()
      .click()
    cy.wait('@apiSegmentTrack')
    cy.wait('@apiPostCustomization')

    // There's a minus in the drawer
    cy.cyGet('removable-icon')

    // Remove one
    cy.cyGet('avatar-container__border')
      .first()
      .click()
    cy.wait('@apiSegmentTrack')
    cy.wait('@apiDeleteCustomization')

    // Skip favorites
    cy.cyGet('button-secondary')
      .click()
    cy.wait('@apiSegmentTrack')

    // should redirect to homepage
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
