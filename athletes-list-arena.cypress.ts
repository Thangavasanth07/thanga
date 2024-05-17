describe('Arena Athletes List', () => {
  const interceptSegmentPage = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  it('loads arena athletes list page with tabs', () => {
    interceptSegmentPage()

    cy.visit('/athletes/0ffa4066-33d0-4ce5-89e3-7e354907b539/results?flosite=flograppling')
    cy.wait('@segmentPageCall')
    cy.url().should('include', 'results')
    cy.cyGet('athlete-header-title').contains('Allison Krantz')
    cy.cyGet('tabs-container').should('exist')
    cy.cyGet('arena-athlete-list-item').first().should('exist')
    cy.cyGet('arena-athlete-list-header').first().should('exist')
    cy.get('button.btn-primary').should('exist')

    // Check placements tab works
    cy.get('.nav-link').contains('Placements').click({ force: true })
    cy.wait('@segmentPageCall')
    cy.url().should('include', 'placements')
    cy.cyGet('arena-athlete-list-item').first().should('exist')
    cy.cyGet('arena-athlete-list-header').first().should('exist')
  })
})

