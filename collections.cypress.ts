describe('Collections', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  beforeEach(() => {
    segmentPageCall()
    cy.initializeExperiments()
    cy.setExperimentToVariation('cxp_1521_new_collection_entity_hubs', 0)
    cy.setExperimentToVariation('cxp_1521_new_athlete_profiles', 0)
  })

  it('Collection by Id', () => {
    cy.visit('/collections/6112394')
    cy.wait('@segmentPageCall')
    cy.cyGet('header-text')
    cy.cyGet('node-list-widget-item-link')
    cy.cyGet('jumbotron')
    cy.cyGet('see-more-btn')
    cy.cyGet('tabs-container')
    cy.cyGet('collection-join-now-button')
      .should('exist')
      .contains('Sign Up')
  })

  it('Collection By Tag', () => {
    cy.visit('/collections/tag/mat-2/video?flosite=flowrestling')
    cy.wait('@segmentPageCall')
    cy.cyGet('header-text')
    cy.cyGet('node-list-widget-item-link')
    cy.cyGet('see-more-btn')
    cy.cyGet('tabs-container')
    cy.cyGet('collection-join-now-button')
      .should('exist')
      .contains('Sign Up')
  })

  describe('Favorite CTA state', () => {
   it('loads Favorite button on eligible collections when logged out', () => {
     segmentPageCall()

     cy.logout()

     // FloRacing - Test Governing Body (Series)
     cy.visit('/collections/tag/whos-number-one-series?flosite=floracing')
     cy.wait('@segmentPageCall')

     cy.cyGet('collection-join-now-button')
       .should('not.exist')

     cy.cyGet('collection-favorite-button')
       .should('exist')
       .contains('Favorite')

     // FloRacing - Test Level (Track)
     cy.visit('/collections/tag/englishtown?flosite=floracing')
     cy.wait('@segmentPageCall')

     cy.cyGet('collection-join-now-button')
       .should('not.exist')

     cy.cyGet('collection-favorite-button')
       .should('exist')
       .contains('Favorite')

     // FloGrappling (athlete)
     cy.visit('/people/5950166-gordon-ryan?flosite=flograppling')
     cy.wait('@segmentPageCall')

     cy.cyGet('collection-join-now-button')
       .should('not.exist')

     cy.cyGet('collection-favorite-button')
       .should('exist')
       .contains('Favorite')

     // FloHoops (team)
     cy.visit('/teams/6108647-real-madrid?flosite=flohoops')
     cy.wait('@segmentPageCall')

     cy.cyGet('collection-join-now-button')
       .should('not.exist')

     cy.cyGet('flo-link')
       .should('exist')
       .contains('Add to Favorites')
   })
    it('loads Sign Up button on ineligible collections when logged out', () => {
      segmentPageCall()

      cy.logout()

      // FloRacing - Test non Governing Body, non Level
      cy.visit('/collections/tag/jr-dragsters?flosite=floracing')
      cy.wait('@segmentPageCall')

      cy.cyGet('collection-favorite-button')
        .should('not.exist')

      cy.cyGet('collection-join-now-button')
        .should('exist')
        .contains('Sign Up')

      // FloGrappling - collection by tag, contentcategory type
      cy.visit('/collections/tag/ibjjf?flosite=flograppling')
      cy.wait('@segmentPageCall')

      cy.cyGet('collection-favorite-button')
        .should('not.exist')

      cy.cyGet('collection-join-now-button')
        .should('exist')
        .contains('Sign Up')

      // FloBaseball - collection by tag, contentcategory type
      cy.visit('/collections/tag/feature/video?flosite=flobaseball')
      cy.wait('@segmentPageCall')

      cy.cyGet('collection-favorite-button')
        .should('not.exist')

      cy.cyGet('collection-join-now-button')
        .should('exist')
        .contains('Sign Up')
    })
  })
  })

