import 'cypress-wait-until'

describe('General Sanity', () => {
  const eventUrl = () => {
    cy.intercept({
      pathname: '/events'
    }).as('GETeventUrl')
  }

  it('checks', () => {
    cy.initializeExperiments()
    eventUrl()

    cy.visit('/events/6381921-2019-beat-the-streets')
    cy.waitUntil(() => {
      return cy.get('flo-content').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')

    cy.visit('/events?date=2022-11-20')
    cy.wait('@GETeventUrl')
    cy.waitUntil(() => {
      return cy.get('flo-table').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('schedule-title')
    cy.cyGet('table-header')
    cy.cyGet('filters')

    cy.visit('/films')
    cy.waitUntil(() => {
      return cy.cyGet('film-header').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('film-container')
    cy.cyGet('thumbnail')
    cy.cyGet('spotlight-title')
    cy.cyGet('spotlight-footnote')
    cy.cyGet('see-more')
    cy.get('input')

    cy.visit('/articles')
    cy.waitUntil(() => {
      return cy.cyGet('newsletter-prompt').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('title')
    cy.cyGet('spotlight-title')
    cy.cyGet('thumbnail')

    cy.visit('/articles/6745189')
    cy.waitUntil(() => {
      return cy.cyGet('article-main-content').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('hero')

    cy.visit('/rankings/6031584-socon-rankings-2017-18/27537-ranked-all-8-socon-125-pounders')
    cy.waitUntil(() => {
      return cy.cyGet('ranking-section').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.get('h1')
    cy.cyGet('description')
    cy.cyGet('ranking-section')
    cy.cyGet('small-subtitle')
    cy.cyGet('content-author')
    cy.cyGet('content-date')
    cy.get('.flo-sort-container')
    cy.cyGet('paywall-button')

    cy.visit('/rankings')
    cy.waitUntil(() => {
      return cy.get('.rankings-page').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('thumbnail')
    cy.cyGet('title')

    cy.visit(`/results`)
    cy.waitUntil(() => {
      return cy.cyGet('results-title').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('results-title')
    cy.cyGet('results-search')
    cy.cyGet('results-list-container')

    cy.visit('/training')
    cy.waitUntil(() => {
      return cy.cyGet('training-container').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('navigation')
    cy.cyGet('footer')
    cy.cyGet('search-title')
    cy.cyGet('training-container')
    cy.cyGet('spotlight-title')
    cy.get('input')
    cy.cyGet('facet-container')
    cy.cyGet('sort-by')
    cy.cyGet('video-container')
    cy.cyGet('result-see-more')
  })
})
