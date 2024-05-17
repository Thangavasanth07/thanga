import 'cypress-wait-until'

describe('Subscription Flows', () => {
  function fillBillingInfo() {
    cy.get('.__PrivateStripeElement > iframe', { timeout: 30000 }).should('be.visible').then(($iframe) => {
      cy.wrap($iframe).click()
      cy.get('iframe').then(($iframe) => {
        const doc = $iframe.contents()
        let input = doc.find('input')[0]
        cy.wrap(input)
          .safeType('4242')
          .safeType('4242')
          .safeType('4242')
          .safeType('4242')
        input = doc.find('input')[1]
        cy.wrap(input)
          .clear()
          .safeType('12')
          .safeType('29')
        input = doc.find('input')[2]
        cy.wrap(input).safeType('123')
        input = doc.find('input')[3]
        cy.wrap(input).safeType('42424')
        cy.cyGet('pay-submit-button').click()
        cy.waitUntil(() => {
          return cy.url().then((url) => url.includes('thank-you'))
        }, { timeout: 30000 })
        cy.contains('Thank You')
      })
    })
  }

  beforeEach(() => {
    cy.initializeExperiments()
    cy.createNewUserAndLogin()
    cy.visit('/')
    cy.get('body').then(($body) => {
      if ($body.find('[data-test="subscribe-button"]').length > 0) {
        cy.get('[data-test="subscribe-button"]').click({ force: true })
      } else {
        cy.get('.link-button > .link-text').contains('SIGN UP').click()
      }
      cy.cyGet('paywall-button').click({ force: true })
      cy.waitUntil(() => {
        return cy.url().then((url) => url.includes('plans'))
      }, { timeout: 30000 })
    })
    cy.wait(2000)
  })

  // These It Blocks check for multiple elements spanning a few different Paycard Variations and experiments
  // It will find the first available and use that for the test selector

  it('should subscribe to the annual plan and verify the thank you page', () => {
    cy.get('.yearly, h3:contains("$12.50"), h3:contains("$150.00")')
      .first()
      .click()
    cy.cyGet('go-to-pay-button').click({ force: true })
    cy.wait(500)
    fillBillingInfo()
  })

  it('should subscribe to the monthly plan and verify the thank you page', () => {
    cy.get('.col-lg-3.month-2999, .monthly, h3:contains("$29.99"), h3:contains("$39.99")')
      .first()
      .click()
    cy.cyGet('go-to-pay-button').click({ force: true })
    cy.wait(500)
    fillBillingInfo()
  })

})
