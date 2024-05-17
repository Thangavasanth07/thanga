/**
 * Test that an event hub results page loads and that some key elements are present
 */
describe('Event Hub Results UI', () => {
  const interceptCalls = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  // We need to visit an event with statx results
  const eventUrlWithStatXResults = '/events/5966714'
  const eventUrlNoStatXResults = '/events/5010181'

  const hasResultsUiElements = () => {
    cy.cyGet('header')
    cy.cyGet('header-title-desktop')
    cy.cyGet('sub-navigation')
    cy.cyGet('entity-hub-main-content')
    cy.cyGet('right-rail')
    cy.cyGet('description')
    cy.get('flo-image-with-buttons').should('exist')
  }

  const hasStatxResultsUiElements = () => {
    hasResultsUiElements()
    cy.get('h5').should('contain', 'Results')
    cy.get('flo-search-filters').should('exist')
    cy.get('flo-filterable-container').should('exist')
    cy.get('flo-slim-header').should('exist')
    cy.get('.grappling-result-card').should('have.length.at.least', 1)
  }

  describe('Has StatX Results', () => {
    it('should have the correct ui elements when no facets query param exists', () => {
      interceptCalls()
      cy.visit(`${eventUrlWithStatXResults}/results`)
      cy.wait('@segmentPageCall')
      hasStatxResultsUiElements()
      cy.get('button.selected').should('contain', 'Results')
      cy.get('flo-slim-header a').should('contain', 'View All')
    })
    it('should have the correct ui elements when facets query param exists', () => {
      interceptCalls()
      cy.visit(`${eventUrlWithStatXResults}/results?facets=%7B"belt":"Black%20Belt","submissionType":"Armbar"%7D`)
      cy.wait('@segmentPageCall')
      hasStatxResultsUiElements()
      cy.get('button.selected').should('contain', 'Results')
      cy.cyGet('event-clear-all-filters-bff')
    })
  })
  describe('View All', () => {
    it('should have the correct ui elements when no facets query param', () => {
      interceptCalls()
      // This is an atypical state, normally the default facet would be in the query params
      cy.visit(`${eventUrlWithStatXResults}/results/view-all`)
      cy.wait('@segmentPageCall')
      hasStatxResultsUiElements()
      // TODO Comment this back in when fixed. This is a bug where the selected button is not highlighted.
      //cy.get('button.selected').should('contain', 'Results')
      cy.cyGet('event-clear-all-filters-bff').should('not.exist')
      cy.get('flo-slim-header a').should('not.contain', 'View All')
      cy.cyGet('back-icon-link')
    })
    it('should have the correct ui elements when default facet selected', () => {
      interceptCalls()
      // This is the normal state when navigating via the ui
      cy.visit(
        `${eventUrlWithStatXResults}/results/view-all?facets=%7B"belt":"Black%20Belt","matchupType":"Black%20Belt"%7D&limit=20&offset=0`
      )
      cy.wait('@segmentPageCall')
      hasStatxResultsUiElements()
      // TODO Comment this back in when fixed. This is a bug where the selected button is not highlighted.
      //cy.get('button.selected').should('contain', 'Results')
      cy.cyGet('event-clear-all-filters-bff').should('not.exist')
      cy.get('flo-slim-header a').should('not.contain', 'View All')
      cy.cyGet('back-icon-link')
    })
  })
  describe('No StatX Results', () => {
    it('should render html for CMS Results', () => {
      interceptCalls()
      cy.visit(`${eventUrlNoStatXResults}/results`)
      cy.wait('@segmentPageCall')
      hasResultsUiElements()
      cy.get('button.selected').should('contain', 'Results')
      cy.get('flo-html-view')
    })
  })
})
