describe('Event Hub Videos UI', () => {
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('When a user loads videos tab on an event hub', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/events/6091773-qa-geo-test/videos')
      cy.wait('@segmentPageCall')
      cy.login()
    })

    it('should have proper url', () => {
      cy.url().should('include', '/events/6091773')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load video tab layout', () => {
      cy.cyGet('header')
      cy.cyGet('header-title-desktop')
      cy.cyGet('header-summary')
      cy.cyGet('sub-navigation')
      cy.cyGet('entity-hub-main-content')
      cy.cyGet('right-rail')
      cy.cyGet('description')
      cy.get('flo-image-with-buttons').should('exist')
      cy.get('button.selected').should('contain', 'Videos')
      cy.get('h5').should('contain', 'Videos')
      cy.get('flo-search-filters').should('exist')
      cy.get('flo-grid-container').should('exist')
    })
  })

  describe('When a user loads a geo blocked video on the event hub', () => {
    it('should show a geo blocked message', () => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/events/6099559-2019-hype-test-geo-blocked/videos?playing=6101109')
      cy.wait('@segmentPageCall')
      cy.cyGet('callout-title').should('contain', 'This event is unavailable in your area.') 
      cy.cyGet('video-player-error-title').should('contain', 'Restricted Viewing Area')
    })
  })
})
