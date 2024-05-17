describe('Watch UI', () => {
  before(() => {
    cy.initializeExperiments()
    cy.visit('/watch')
  })

  // FloDogs
  it('should have Watch On Web UI', () => {
    cy.cyGet('navigation')
    cy.cyGet('thumbnail')
    cy.cyGet('title')
    cy.cyGet('watch')
    cy.cyGet('watch-quick-links')
    cy.cyGet('watch-carousel-container')
    cy.cyGet('watch-carousel-scroll')
  })

  // three sites that support favorites
  it('should show my-stuff cta for anon user', () => {
    cy.visit('/watch?flosite=floracing')
    cy.cyGet('personalization-cta')
    // Show badge text on live events
    cy.cyGet('badge-text')
  })

  it('should show personalization-cta for anon user', () => {
    cy.visit('/watch?flosite=flofc')
    cy.cyGet('personalization-cta')
  })

  it('should show personalization-cta for anon user', () => {
    cy.visit('/watch?flosite=flowrestling')
    cy.cyGet('personalization-cta')
  })

  // logged-in user, will see my-stuff on a site that support favorites
  it('should show my-stuff cta for anon user', () => {
    cy.login()
    cy.visit('/watch?flosite=floracing')
    cy.cyGet('watch-favorites-header')
  })

  // three sites that do not support favorites
  it('should not show personalization-cta on sites than do not support favorites', () => {
    cy.visit('/watch?flosite=flotrack')
    cy.cyGet('personalization-cta').should('not.exist')
  })

  it('should not show personalization-cta on sites than do not support favorites', () => {
    cy.visit('/watch?flosite=flomarching')
    cy.cyGet('personalization-cta').should('not.exist')
  })

  it('should not show personalization-cta on sites than do not support favorites', () => {
    cy.visit('/watch?flosite=varsity')
    cy.cyGet('personalization-cta').should('not.exist')
  })

  it('should not show my-stuff cta for anon user', () => {
    cy.login()
    cy.visit('/watch?flosite=varsity')
    cy.cyGet('watch-favorites-header').should('not.exist')
  })
})
