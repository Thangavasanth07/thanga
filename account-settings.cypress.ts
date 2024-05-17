import 'cypress-wait-until'

describe('Account Settings', () => {

  before(() => {
    cy.initializeExperiments()
    cy.login()
    cy.visit('/account')
  })

  it('account info & edit profile', {
    retries: {
      runMode: 2,
      openMode: 2
    }
  },
    () => {
    cy.visit('/account')
    cy.waitUntil(() => {
        return cy.cyGet('account-title-header').should('be.visible').then(() => true)
      }, { timeout: 10000, interval: 1000 })
    cy.cyGet('account-settings-menu')
    cy.cyGet('account-image-container')
    cy.get('.btn-upload-photo').should('be.visible')
    cy.cyGet('account-title-header')
    cy.cyGet('account-email-header')
    cy.cyGet('email-value')
    cy.cyGet('username-label')
    cy.cyGet('username-value')
    cy.cyGet('name-first-label')
    cy.cyGet('name-first-value')
    cy.cyGet('name-last-label')
    cy.cyGet('name-last-value')
    cy.cyGet('member-label')
    cy.cyGet('member-value')
    cy.cyGet('country-label')
    cy.cyGet('country-value')
    cy.cyGet('postal-label')
    cy.cyGet('postal-value')
    cy.cyGet('phone-label')
    cy.cyGet('phone-value')

    cy.cyGet('edit-profile-button').click()
    cy.cyGet('email-form')
    cy.cyGet('username-form').clear().safeType('Mark Rosenthal')
    cy.cyGet('name-first-form').clear().safeType('Mark')
    cy.cyGet('name-last-form').clear().safeType('Rosenthal')
    cy.cyGet('country-form')
    cy.cyGet('postal-form').clear().safeType('78610')
    cy.cyGet('phone-form').clear().safeType('512-478-6873')
    cy.cyGet('cancel-link').click({ force: true })
    cy.cyGet('edit-profile-button').click({ force: true })
  })

  it('change password', () => {
    cy.get('.link-password').click()
    cy.cyGet('current-password-form').safeType('Florocks123')
    cy.cyGet('new-password-form').safeType('Florocks123')
    cy.cyGet('confirm-password-form').safeType('Florocks123')
    cy.cyGet('password-cancel')
    cy.cyGet('password-submit').click({ force: true })
    cy.get('.primary-color-bg').contains('Your Password has been updated successfully')
  })

  it('update credit card', () => {
    cy.cyGet('account-subscription').click()
    cy.cyGet('sub-title')

    // Manage subscription
    cy.cyGet('row-0').first().click()
    cy.cyGet('cancel-link')
    cy.cyGet('next-payment-date')
    cy.cyGet('signed-up-on')

    // Update Card
    cy.cyGet('cc-form')
    cy.cyGet('cc-update').click()
    cy.cyGet('cc-name-form').safeType('Mark Rosenthal')
    cy.get('iframe[src*="js.stripe.com"]').then(($iframe)  => {
      const $body = $iframe.contents().find('body')
      cy.wrap($body)
        .find('input[autocomplete="cc-number"]')
        .type('4242424242424242', { force: true })
      cy.wrap($body)
        .find('input[autocomplete="cc-exp"]')
        .type('03/30', { force: true })
      cy.wrap($body)
        .find('input[autocomplete="cc-csc"]')
        .type('737', { force: true })
      cy.wrap($body)
        .find('input[autocomplete="postal-code"]')
        .type('78702', { force: true })
    })
    cy.get('.btn-update-card').click()
    cy.waitUntil(() => {
      return cy.get('.alert').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.get('.alert')
      .contains('You have successfully updated your credit card information.')
  })
})
