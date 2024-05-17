import 'cypress-wait-until'

describe('Athletes', () => {

  it('loads correctly', () => {
    const minimumNumberOfExpectedAvatars = 40
    cy.visit('/people')
    cy.waitUntil(() => {
      return cy.cyGet('category-header').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })

    // Header is 'Athletes' (css capitalizes it)
    cy.cyGet('category-header')
      .should('contain.text', 'athletes')

    // There are minimum N avatars, and each has an href to a collections page
    cy.cyGet('category-list-item')
      .its('length').should('be.gte', minimumNumberOfExpectedAvatars)

    // Each avatar has an image
    cy.cyGet('avatar-image')
      .each($el => {
        expect($el).attr('src').contains('cloudfront.net')
        expect($el).attr('src').contains('width=400')
        expect($el).attr('src').contains('quality=80')
      })

  })
})
