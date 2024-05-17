import 'cypress-wait-until'

describe('Entitlement Checks', () => {

  beforeEach(() => {
    cy.initializeExperiments()
  })

  it('FREE - Homepage routing', () => {
    cy.visit('/')
    cy.nonPremiumLogin()
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="subscribe-button"]').length > 0) {
        cy.get('[data-test="subscribe-button"]').click({ force: true })
      } else {
        cy.get('.link-button > .link-text').contains('SIGN UP').click()
        cy.url().should('include', '/signup')
      }
    })
  })

  it('FREE - Premium VOD', () => {
    cy.visit('/films?sort=view_count')
    cy.cyGet('pro').first().click()
    cy.url().should('include', 'playing')
    cy.get('.paywall')
  })

  it('FREE - Article', () => {
    cy.visit('/articles/6119535-article-pro-vod-hero-automation')
    cy.cyGet('paywall-button').first().click()
    cy.url().should('include', '/signup')
  })

  it('FREE - Live', () => {
    cy.visit('/live/11708')
    cy.url().should('include', '/signup')
    cy.logout()
  })

  it('PREMIUM - Homepage ', () => {
    cy.login()
    cy.visit('/films?sort=view_count')
    cy.cyGet('pro').first().click()
    cy.url().should('include', 'playing')
    cy.get('.paywall').should('not.exist')
  })

  it('PREMIUM - Premium VOD', () => {
    cy.login()
    cy.visit('/films?sort=view_count')
    cy.cyGet('pro').first().click()
    cy.url().should('include', 'playing')
    cy.get('.paywall').should('not.exist')
  })

  it('PREMIUM - Article', () => {
    cy.login()
    cy.visit('/articles/6119535-article-pro-vod-hero-automation')
    cy.cyGet('paywall-button').should('not.exist')
  })

  it('PREMIUM - Live', () => {
    cy.login()
    cy.visit('/live/11708')
    cy.url().should('include', '/live/11708')
  })
})
