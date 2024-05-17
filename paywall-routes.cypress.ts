describe('Paywall Routes', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentCallApi')
    cy.initializeExperiments()
  })

  describe('PRO Content', () => {

    it('collection - pro', () => {
      cy.visit('/collections/6112394')
      cy.wait('@segmentCallApi')
      cy.cyGet('collection-primary-cta').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })

    it('article - pro', () => {
      cy.visit('/articles/6119535-article-pro-vod-hero-automation')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-button').first().click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })

    it('article - vod hero', () => {
      cy.visit('/articles/6103693-fe-automation-vod-article-embed')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-button').first().click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', 'redirect')
    })

    it('films - pro', () => {
      cy.logout()
      cy.visit('/films?sort=view_count')
      cy.cyGet('pro').first().click()
      cy.url().should('include', 'playing')
      cy.get('.paywall')
    })

    it('training - pro', () => {
      cy.visit('/training?sort=view_count')
      cy.cyGet('pro').first().click()
      cy.url().should('include', 'playing')
      cy.get('.paywall')
    })

    it('ranking - pro', () => {
      cy.visit('/rankings/6082083-automation-ranking/27248-test')
      cy.cyGet('paywall-button').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })
  })

  describe('Paywall Direct routes', () => {

    it('event - direct url', () => {
      cy.visit('/live/11708')
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })

    it('vod - direct url', () => {
      cy.visit('/films?playing=6093252')
      cy.wait('@segmentCallApi')
      cy.url().should('include', 'playing')
      cy.get('.paywall')
    })

    it('article - direct url', () => {
      cy.visit('/articles/6127397-qa-cypress-vod-embed-automation')
      cy.wait('@segmentCallApi')
      cy.cyGet('article-paywall')
    })

    it('training - direct url', () => {
      cy.visit('/training?playing=6102729')
      cy.wait('@segmentCallApi')
      cy.url().should('include', 'playing')
      cy.cyGet('paywall-button')
    })

    it('ranking - direct url', () => {
      cy.visit('/rankings/6082083-automation-ranking/27248-test')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-button')
    })
  })

  describe('Login Routes', () => {
    it('home - navbar signup', () => {
      cy.visit('/')
      cy.cyGet('flo-link')
        .contains('SIGN UP')
        .click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })

    it('home - login', () => {
      cy.visit('/')
      cy.cyGet('flo-link')
        .contains('Log In')
        .click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('watch - navbar signup', () => {
      cy.visit('/watch')
      cy.cyGet('flo-link')
        .contains('SIGN UP')
        .click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })

    it('watch - login', () => {
      cy.visit('/watch')
      cy.cyGet('flo-link')
        .contains('Log In')
        .click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('event - login', () => {
      cy.visit('/signup?redirect=%2Flive%2F11708')
      cy.wait('@segmentCallApi')
      cy.cyGet('checkout-login').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('article - login', () => {
      cy.visit('/articles/6085910-this-is-for-qa-do-not-delete')
      cy.logout()
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-login').first().click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('training - login', () => {
      cy.visit('/training?playing=6102729')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-login').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('vod - login', () => {
      cy.visit('/films?playing=6093252')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-login').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('ranking - login', () => {
      cy.visit('/rankings/6082083-automation-ranking/27248-test')
      cy.wait('@segmentCallApi')
      cy.cyGet('paywall-login').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/login')
    })

    it('collection-login', () => {
      cy.visit('/collections/6112394')
      cy.wait('@segmentCallApi')
      cy.cyGet('collection-primary-cta').click()
      cy.wait('@segmentCallApi')
      cy.url().should('include', '/signup')
    })
  })
})
