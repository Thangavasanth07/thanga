import 'cypress-wait-until'

describe('Teams - Single List', () => {

  it('loads correctly', () => {
    const minimumNumberOfExpectedAvatars = 70

    cy.visit('/teams')
    cy.waitUntil(() => {
      return cy.cyGet('category-header').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })

    // Header is 'teams' (css capitalizes it)
    cy.cyGet('category-header')
      .should('contain.text', 'teams')

    // There are minimum of N avatars, and each has an href to a collections page
    cy.cyGet('category-list-item')
      .each(($el) => {
        expect($el).attr('href').contains('/teams/')
      })
      .its('length').should('be.gte', minimumNumberOfExpectedAvatars)

    // Each avatar has an image
    cy.cyGet('avatar-image')
      .each($el => {
        expect($el).attr('src').contains('cloudfront.net')
      })
  })
})

describe('Teams - Grouped List', () => {

  it('loads correctly', () => {
    const minimumNumberOfExpectedAvatars = 24
    cy.visit('https://www.flobaseball.tv/teams')
    cy.waitUntil(() => {
      return cy.cyGet('category-header').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    // Header is 'teams' (css capitalizes it)
    cy.cyGet('category-header')
      .should('contain.text', 'teams')

    // There are at least N categories, at least 1 with a href to a facet
    cy.cyGet('grouped-header')
      .filter((index: number, el: HTMLElement) => {
        // @ts-ignore
        return el.getAttribute('href').toString().includes('/teams?facets=')
      })
      .should('have.length.gte', 1)

    // There are minimum of N total avatars, and each has an href to a collections page
    cy.cyGet('category-list-item')
      .its('length').should('be.gte', minimumNumberOfExpectedAvatars)

    // Each avatar has an image of correct size and quality
    cy.cyGet('avatar-image')
      .each($el => {
        expect($el).attr('src').contains('cloudfront.net')
        expect($el).attr('src').contains('width=400')
        expect($el).attr('src').contains('quality=80')
      })

    // Click the first view-all CTA and verify url has updated to the correct facet
    cy.cyGet('cta').first().click()
    cy.url().should('include', `https://www.flobaseball.tv/teams?facets=%7B%22Governing%20Body%22:%22NCAA%22%7D`)
  })
})
