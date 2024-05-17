describe('Articles UI', () => {
  const setUpApiSpies = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/api/users/newsletter*'
    }).as('apiNewsletterPOSTSuccess')
    cy.intercept({
      method: 'GET',
      pathname: '/api/users/check-email-exists/*'
    }).as('checkEmail')
  }
  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  describe('Articles List Page', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/articles')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/articles')
    })

    it('should load basic page layout', () => {
      cy.cyGet('navigation')
      cy.cyGet('footer')
    })

    it('should load articles list page content', () => {
      cy.cyGet('thumbnail')
      cy.cyGet('spotlight-title')
      cy.cyGet('spotlight-footnote')
      cy.cyGet('title')
      cy.cyGet('thumbnail')
      cy.cyGet('static-content-card')
      cy.cyGet('static-content-text')
      cy.cyGet('static-publish-date')
      cy.cyGet('static-description')
      cy.cyGet('desktop-see-more')
    })

    it('should have functioning newsletter prompt', () => {
      setUpApiSpies()

      const email = `mark.rosenthal+cypress${Date.now()}${Math.floor(Math.random() * 90) + 10}@flosports.tv`
      cy.cyGet('newsletter-prompt')
      cy.get('.form-control').clear().safeType(email)
      cy.wait('@checkEmail')
      cy.cyGet('newsletter-submit').click()
      cy.wait('@apiNewsletterPOSTSuccess')
      cy.cyGet('newsletter-success')
    })
  })

  describe('Individual Article Page', () => {
    before(() => {
      cy.initializeExperiments()
      segmentPageCall()
      cy.visit('/articles/6128778-premium-article-with-pro-vod-hero')
      cy.wait('@segmentPageCall')
    })

    it('should have proper url', () => {
      cy.url().should('include', '/articles').and('include', '6128778')
    })

    it('should load article page content', () => {
      cy.cyGet('drillthrough-link')
      cy.cyGet('description')
      cy.cyGet('hero')
      cy.cyGet('content')
      cy.cyGet('content-date')
      cy.scrollTo('bottom')
      cy.cyGet('below-content-related-content')
      cy.cyGet('article-rail')
    })
  })
})
