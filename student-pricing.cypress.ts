import 'cypress-wait-until'

describe('Student Pricing in funnel', () => {
  const flohoopsLogin = '/login/?flosite=flohoops&redirect=%2Fplans'
  const offersCall = () => {
    cy.intercept({
      method: 'GET',
      pathname: '/api/experiences/web/partials/offers'
    }).as('offersCallApi')
  }


  it('should display student pricing if a student email is present', () => {
    offersCall()
    cy.logout()
    cy.visit(flohoopsLogin)

    cy.waitUntil(() => {
      return cy.get('.funnel-title').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('email-login').safeType('testaccount@butler.edu')
    cy.cyGet('password').safeType('testaccount@butler.edu')
    cy.cyGet('login').click()


    cy.wait('@offersCallApi', {
      timeout: 5000
    })
    // Wait for login to complete & for the next /plans page to load
    // Monthly Card
    cy.cyGet('plan-cost-desktop').eq(0).should(($price) => {
      const priceText = $price.text().replace('$', '')
      const price = parseFloat(priceText)
      expect(price).to.be.lessThan(12.50)
    })

    // Yearly Card
    cy.cyGet('plan-cost-desktop').eq(1).should(($price) => {
      const priceText = $price.text().replace('$', '')
      const price = parseFloat(priceText)
      expect(price).to.be.lessThan(29.99)
    })
  })
})
