import 'cypress-wait-until'

const commonProps = [
  'Stream unlimited events live or on-demand',
  'Access the full library of Varsity content',
  'Get HD-quality streams and videos',
  'Watch on web or the FloSports app-available on iOS, Android, Apple TV, Roku, Amazon Fire, and Chromecast',
]

const monthlyValueProps = [
  'Billed as $29.99 Monthly',
  ...commonProps,
]

const yearlyValueProps = [
  'Save $210 per year',
  'Billed as $150.00 Annually',
  ...commonProps,
]

describe('Offers UI', () => {

  const segmentPageCall = () => {
    cy.intercept({
      method: 'POST',
      pathname: '/v1/p'
    }).as('segmentPageCall')
  }

  beforeEach(() => {
    cy.initializeExperiments()
    cy.setExperimentToVariation('cxp_2618_feat_pricing_arch', 1)
    segmentPageCall()
  })

  it('Should select a yearly and monthly offers', () => {
    cy.createNewUserAndLogin()
    /**
     * TODO: Remove the query param once the the ticket is completed:
     * link: https://flocasts.atlassian.net/browse/CXP-4767
     **/ 
    cy.visit('plans?ab-forced=cxp_2618_feat_pricing_arch-1&flosite=varsity')

    // Validate offers are displayed
    cy.get('.offer-tiles-wrapper')
    cy.get('.offers-mobile-wrapper')

    // Validate monthly offer properties
    cy.cyGet('plan-title-desktop').eq(1).contains('Monthly Plan')
    cy.cyGet('plan-cost-desktop').eq(1).contains('$29.99')

    // Validate monthly offer value props
    cy.cyGet('offer-selection-card-horizontal').eq(1).within(() => {
      cy.get('.value-prop').each((node, index) => {
        cy.wrap(node).should("contain.text", monthlyValueProps[index])
      })
    })

    // Validate yearly offer properties
    cy.cyGet('plan-title-desktop').eq(0).contains('Annual Plan')
    cy.cyGet('plan-cost-desktop').eq(0).contains('$12.50')

    // Validate yearly offer value props
    cy.cyGet('offer-selection-card-horizontal').eq(0).within(() => {
      cy.get('.value-prop').each((node, index) => {
        cy.wrap(node).should("contain.text", yearlyValueProps[index])
      })
    })

    // Select monthly plan and go to pay
    cy.cyGet('plan-cost-desktop').eq(1).click()
    cy.cyGet('go-to-pay-button').click()
    cy.wait('@segmentPageCall')
    
    // Validate monthly plan was selected
    cy.cyGet('footer-confirm-payment').contains('$29.99')

    // Return to plans page
    cy.cyGet('change-plan').click()
    cy.wait('@segmentPageCall')

    // Select yearly plan and go to pay
    cy.cyGet('plan-cost-desktop').eq(0).click()
    cy.cyGet('go-to-pay-button').click()
    cy.wait('@segmentPageCall')

    // Validate yearly plan was selected
    cy.cyGet('footer-confirm-payment').contains('$150.00')
  })
})
