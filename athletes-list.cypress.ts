const flograppling = '/?flosite=flograppling'

describe('Athletes List', () => {
  const interceptSegmentPage = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  it('loads athletes list page and navigates to a specific person when clicked', () => {
    interceptSegmentPage()
    cy.initializeExperiments()

    cy.visit('/people' + flograppling)
    cy.wait('@segmentPageCall')
    cy.get('flo-primary-navigation a[href*="/people"]').should('exist')

    cy.cyGet('category-header').contains('athletes')
    cy.cyGet('scrollable-view').should('exist')
    cy.cyGet('category-list-item').should('have.length.greaterThan', 1)

    // Ensure navigation & load of person after click
    cy.cyGet('category-list-item').first().click()
    cy.wait('@segmentPageCall')
    cy.url().should('include', '/people/')
  })
})

describe('Athletes List - Search', () => {
  const interceptSegmentPage = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  const athleteSearchTerm = 'Gordon Ryan'

  const interceptSearchCalls = () => {
    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/legacy-core/search',
      query: {
        q: athleteSearchTerm + '*',
      }
    }).as('searchAthleteCall')

    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/legacy-core/search',
      query: {
        q: 'nonsense*'
      }
    }).as('searchNonsense')
  }

  it('finds Athlete in search', () => {
    interceptSegmentPage()
    cy.initializeExperiments()
    interceptSearchCalls()

    // desktop
    cy.visit('/people' + flograppling)
    cy.cyGet('search-container-desktop').should('exist')
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box').first().children('input[type="text"]').clear().type(athleteSearchTerm)
    cy.wait('@searchAthleteCall')
    cy.cyGet('scrollable-view').should('exist')
    cy.cyGet('category-list-item').should('have.length.at.least', 1).should('contain.text', athleteSearchTerm)

    // mobile
    cy.visit('/people' + flograppling)
    cy.cyGet('search-container-mobile').should('exist')
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box').first().children('input[type="text"]').clear().type(athleteSearchTerm)
    cy.wait('@searchAthleteCall')
    cy.cyGet('scrollable-view').should('exist')
    cy.cyGet('category-list-item').should('have.length.at.least', 1).should('contain.text', athleteSearchTerm)
    cy.cyGet('no-results').should('not.exist')
  })

  it('displays no results messaging when nothing is found', () => {
    interceptSegmentPage()
    cy.initializeExperiments()
    interceptSearchCalls()

    cy.visit('/people' + flograppling)
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box').first().children('input[type="text"]').type('nonsense')
    cy.wait('@searchNonsense')
    cy.cyGet('scrollable-view').should('not.exist')
    cy.cyGet('no-results').should('exist')
  })
})
