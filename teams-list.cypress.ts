const flohoops = '/?flosite=flohoops'

describe('teams list', () => {
  const teamSearch = 'Real Madrid'
  const interceptCalls = () => {
    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/legacy-core/search',
      query: {
        q: teamSearch + '*'
      }
    }).as('searchTeamCall')

    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/legacy-core/search',
      query: {
        q: 'nonsense*'
      }
    }).as('searchNonsense')

    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  it('header has teams in nav', () => {
    cy.initializeExperiments()

    cy.visit(flohoops)
    cy.get('flo-primary-navigation a[href*="/teams"]').should('exist')
  })

  it('loads teams and navigates to a valid team collection page when clicked', () => {
    interceptCalls()
    cy.initializeExperiments()

    cy.visit('/teams' + flohoops)
    cy.wait('@segmentPageCall')
    cy.cyGet('category-header').contains('teams')
    cy.cyGet('scrollable-view').cyGet('category-list-item').should('have.length.greaterThan', 1)
    cy.cyGet('category-list-item').first().click()
    cy.wait('@segmentPageCall')
    cy.url().should('include', '/teams/')
  })

  it('finds Team in search', () => {
    interceptCalls()
    cy.initializeExperiments()

    // desktop
    cy.visit('/teams' + flohoops)
    cy.cyGet('search-container-desktop').should('exist')
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box').first().children('input[type="text"]').clear().type(teamSearch)
    cy.wait('@searchTeamCall')
    cy.cyGet('scrollable-view').should('exist')
    cy.cyGet('category-list-item').should('have.length', 1).should('contain.text', teamSearch)

    // mobile
    cy.visit('/teams' + flohoops)
    cy.cyGet('search-container-mobile').should('exist')
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box').first().children('input[type="text"]').clear().type(teamSearch)
    cy.wait('@searchTeamCall')
    cy.cyGet('scrollable-view').should('exist')
    cy.cyGet('category-list-item').should('have.length', 1).should('contain.text', teamSearch)
    cy.cyGet('no-results').should('not.exist')
  })

  it('displays no results messaging when nothing is found', () => {
    interceptCalls()
    cy.initializeExperiments()

    cy.visit('/teams' + flohoops)
    cy.cyGet('search-container-desktop').should('exist')
    cy.wait('@segmentPageCall')
    cy.cyGet('search-box')
      .children('input[type="text"]')
      .first()
      .type('nonsense', { delay: 0 })
      .should('have.value', 'nonsense')
    cy.wait('@searchNonsense')
    cy.cyGet('scrollable-view').should('not.exist')
    cy.cyGet('no-results').should('exist')
  })
})
