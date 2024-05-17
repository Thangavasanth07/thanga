describe('app', () => {
  it('should have expected content, load once, and post to segment', () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentSpy')

    cy.visit('/')
    cy.wait('@segmentSpy')
    
    cy.get('#flo-app-state')
    cy.get('title').contains('Flo')
    cy.get('link[rel="icon"][type="image/png"]')
  })

  it('should serve app files', () => {
    cy.request('/ping.html').then(response => {
      expect(response.status).equals(200)
    })

    cy.request('/robots.txt').then(response => {
      expect(response.body).contains('Allow: .js')
    })

    cy.request('/ads.txt').then(response => {
      expect(response.body).contains('google.com, pub-')
    })

    cy.request('/BingSiteAuth.xml').then(response => {
      expect(response.body).contains('xml')
    })

    cy.request('/googlef481d40a1c9dbc6e.html').then(response => {
      expect(response.body).contains('google-site-verification: googlef481d40a1c9dbc6e.html')
    })

    cy.request('/.well-known/apple-app-site-association').then(response => {
      const header = response.headers['content-type']
      expect(header).equals('application/json')
    })

    cy.request("/.well-known/assetlinks.json").then(response => {
      const header = response.headers['content-type']
      expect(header).equals('application/json')
    })
  })
})
