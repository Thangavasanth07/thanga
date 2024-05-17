describe.skip('API A/B Test', () => {
  describe('A User sees the same variation throughout their visit', () => {
    it('gets a header "x-flo-flags-all" from API requests, and sends it on subsequent requests', () => {
      cy.server()
      cy.route(/api\..*\/api\/(?!tix)(?!view)/).as('api')
      cy.visit('/events')
      cy.get('a').contains('Events').first().click({ force: true })

      cy.get('i.logo > svg').click({ force: true })
      cy.wait('@api').its('request').its('headers').its('x-flo-flags-all').should('exist')

      cy.get('#primaryLinks > li > a[name="Events"]').click({ force: true })
      cy.wait('@api').its('request').its('headers').its('x-flo-flags-all').should('exist')
    })
  })

  describe('An Analyst calculates experiment results', () => {
    it('sends an "Experiment Viewed" event every time a user views a server generated experiment', () => {
      // we don't know how many track calls will be made on any given page
      // load as experiments are added and removed. Currently, Cypress
      // doesn't offer a way to check for the existence of a certian value
      // (eg 'Experiment Viewed') on one of many requests to the same url.
      cy.server()
      cy.route({
        url: 'https://siop.flosports.tv/v1/t',
        method: 'post',
        response: { success: true }
      }).as('track')
      cy.route({
        url: /api\..*\/api\/(?!tix)(?!view)/,
        headers: {
          'x-flo-ab': 'test-1'
        },
        response: { success: true }
      }).as('api')
      cy.visit('/events')
      cy.wait('@track')
      cy.wait('@track').its('request').its('body').should('exist')
    })
  })
})
