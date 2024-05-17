import { dataTestSelector } from '../../src/testing/utility-functions/data-test-selector'
/**
 * Test that filter, search, and result card functionality works
 * for an event hub result with statx data present
 */
describe('Event Hub Results', () => {
  const interceptCalls = () => {
    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/event-hub/*/'
    }).as('apiGETEventResults')

    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/event-hub/*/results/partial'
    }).as('apiGETEventResultsPartial')

    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/event-hub/*/results/list/partial'
    }).as('apiGETEventResultsViewAllPartial')
  }

  // We need to visit an event with statx results
  const eventUrl = '/events/5966714'

  before(() => {
    cy.initializeExperiments()
  })

  const testSearchBox = (
    hasDefaultResults: () => void,
    searchTerm: string,
    expectedResults: number,
    apiEvent: string
  ): void => {
    interceptCalls()

    // Confirm we are starting with a clean slate
    hasDefaultResults()

    // Enter a search term and await the results
    cy.cyGet('search-box').children('input[type="text"]').first().safeType(searchTerm).should('have.value', searchTerm)
    cy.wait(apiEvent)

    // Confirm that our search restricts the data set to the expected amount of athletes
    cy.get('flo-grappling-result-card').should('have.length', expectedResults)

    // Clicking clear search button should reset the search term to blank
    cy.cyGet('clear-search-btn').click()
    cy.cyGet('search-box').children('input[type="text"]').first().should('have.value', '')

    // After clearing the search term, the results should be reset
    hasDefaultResults()
  }

  const testFilters = (hasDefaultResults: () => void, expectedResults: number): void => {
    // Confirm we are starting with a clean slate
    hasDefaultResults()

    cy.get('button#filter-submissionType').click().should('have.text', 'Submission Type ')

    // Select the first element in the dropdown (Armbar) which then changes the btn text
    cy.get('div[aria-labelledby="filter-submissionType"]').children('button.dropdown-item').first().click()
    cy.get('button#filter-submissionType').should('have.text', 'Armbar ')

    // Confirm that after selecting the armbar filter, we see the expected amount of results
    cy.get('flo-grappling-result-card').should('have.length', expectedResults)

    // If necessary, click the button
    // Clicking will scroll filters all the way to the right revealing the Clear All button
    // It won't always be present as it is a dynamically sized section
    cy.get('body')
      .then(body => {
        if (body.find(dataTestSelector('right-scroll-control')).length) {
          cy.cyGet('right-scroll-control').then(button => {
            return Cypress.dom.isVisible(button as HTMLElement)
          })
        }
      })
      .then(hasRightScrollButton => {
        if (hasRightScrollButton) {
          cy.cyGet('right-scroll-control').click()
        }
      })

    // Clear the selected filters
    cy.cyGet('event-clear-all-filters-bff').click()

    hasDefaultResults()
  }

  describe('Search & Filters', () => {
    const hasDefaultResults = () => {
      cy.get('flo-grappling-result-card').should('have.length', 6)
    }
    it('should render properly when no search or filters are specified', () => {
      cy.visit(`${eventUrl}/results`)
      hasDefaultResults()
    })

    it('should filter results properly based on dropdowns selected in url', () => {
      cy.visit(`${eventUrl}/results?facets=%7B"belt":"Black%20Belt","submissionType":"Armbar"%7D`)
      cy.get('button#filter-submissionType').should('have.text', 'Armbar ')
      cy.get('flo-grappling-result-card').should('have.length', 2)
    })

    it('should have a functional search box', () => {
      cy.visit(`${eventUrl}/results`)
      testSearchBox(hasDefaultResults, 'Ma', 4, '@apiGETEventResultsPartial')
    })

    it('should have functional filters', () => {
      cy.visit(`${eventUrl}/results`) //TODO Combine this with the assertion above
      testFilters(hasDefaultResults, 2)
    })
  })

  describe('View All', () => {
    const hasDefaultResults = () => {
      cy.get('flo-grappling-result-card').should('have.length', 8)
    }

    it('should render properly when no search or filters are specified', () => {
      cy.visit(`${eventUrl}/results/view-all`)
      hasDefaultResults()
    })

    it('should filter results properly based on default facets selected in url (black belt)', () => {
      cy.visit(
        `${eventUrl}/results/view-all?facets=%7B"belt":"Black%20Belt","matchupType":"Black%20Belt"%7D&limit=20&offset=0`
      )
      cy.get('flo-slim-header h2').should('have.text', 'Black Belt')
      hasDefaultResults()
    })

    it('should have a functional search box', () => {
      cy.visit(`${eventUrl}/results/view-all`)
      // There are four athletes with ma (case insensitive) in their name
      testSearchBox(hasDefaultResults, 'Ma', 4, '@apiGETEventResultsViewAllPartial')
    })

    it('should have functional filters', () => {
      cy.visit(`${eventUrl}/results/view-all`) //TODO Combine this with the assertion above
      testFilters(hasDefaultResults, 2)
    })
  })
})
