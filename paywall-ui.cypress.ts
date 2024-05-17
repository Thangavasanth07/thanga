/// <reference types="cypress-iframe" />
import 'cypress-wait-until'

describe('Paywall UI', () => {

  before(() => {
    cy.initializeExperiments()
  })

  function fillBillingInfoForUi() {
    // This will verify that the iframe is loaded. Targeting specific iframe as there are many on the page including recaptcha
    cy.frameLoaded('.__PrivateStripeElement > iframe[name^="__privateStripeFrame"]')
    cy.iframe('.__PrivateStripeElement > iframe[name^="__privateStripeFrame"]')
      .find('input#Field-numberInput')
      .should('be.visible')
      .click()

    cy.iframe('.__PrivateStripeElement > iframe[name^="__privateStripeFrame"]').then($iframe => {
      const doc = $iframe.contents()
      const cc = doc.find('input')[0]
      cy
        .wrap(cc)
        .type('4242')
        .type('4242')
        .type('4242')
        .type('4242')

      const expiration = doc.find('input#Field-expiryInput')
      cy
        .wrap(expiration)
        .clear()
        .type('12')
        .type('29')

      const cvc = doc.find('input#Field-cvcInput')
      cy.wrap(cvc)
        .type('123')

      const zip = doc.find('input#Field-postalCodeInput')
      cy
        .wrap(zip)
        .type('42424')

      cy.cyGet('pay-submit-button').click()
    })
  }

  it('Signup to Create Account to Pay to Thanks', () => {
    cy.createNewUserAndLogin()
    cy.visit('/signup')
    cy.cyGet('flo-logo')
    cy.cyGet('paywall-content-wrapper')
    cy.get('.funnel-title')
    cy.cyGet('partner-logo-desktop')
    cy.cyGet('hero-section')
    cy.cyGet('paywall-calendar-container')
    cy.cyGet('carousel-control')
    cy.get('.batman-wrapper')
    cy.cyGet('checkout-faq-container')
    cy.cyGet('footer')
    cy.cyGet('paywall-button').click({ force: true })

    // Plans UI
    cy.get('section')
    cy.get('.plans-desktop-wrapper')
    cy.cyGet('plan-selection-card-desktop')
    cy.cyGet('go-to-pay-button').click({ force: true })

    // Pay UI
    cy.cyGet('funnel-payment-title')
    cy.cyGet('plan-price')
    cy.cyGet('change-plan')
    cy.cyGet('funnel-form-footnotes')
    cy.cyGet('footer-confirm-payment')
    fillBillingInfoForUi()
    cy.waitUntil(() => {
      return cy.url().then(url => url.includes('thank-you'))
    }, { timeout: 30000 })
    /*right now, this timeout is required - looking into solutions to remove. It does not WAIT but simply will not let the test
    continue until the requirements are satisfied. Updating to a newer Cypress Version may be a help here*/
    cy.contains('Thank You')
  })
})
