describe('Article Paywall', () => {
  beforeEach(() => {
    cy.initializeExperiments()
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentSpy')
  })

  it('non pro paywall', () => {
    cy.visit('/articles/6128777-premium-article-with-free-vod-hero')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('paywall-button')
      .first()
      .click({force: true})
    cy.location('href').should('include', '/signup')
  })

  it('pro paywall', () => {
    cy.login()
    cy.visit('/articles')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('paywall-button')
      .should('not.exist')
  })
})

describe('Article VOD', () => {
  beforeEach(() => {
    cy.initializeExperiments()
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentSpy')
  })

  it('free vod hero', () => {
    cy.login()
    cy.visit('/articles/6103836-vod-automation-article-hero')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('video-container')
    cy.cyGet('hero')
  })

  it('pro vod hero', () => {
    cy.visit('/articles/6128778-premium-article-with-pro-vod-hero')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('paywall-button')
      .first()
      .click({force: true})
  })

  it('vod pro embed - logged in', () => {
    cy.login()
    cy.visit('/articles/6103693-fe-automation-vod-article-embed')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('paywall-button')
      .should('not.exist')
  })

  it('vod pro embed - paywall', () => {
    cy.visit('/articles/6103693-fe-automation-vod-article-embed')
    cy.wait('@segmentSpy') // Wait for page to load
    cy.cyGet('paywall-button')
      .first()
      .click({force: true})
    cy.wait('@segmentSpy')
  })
})
