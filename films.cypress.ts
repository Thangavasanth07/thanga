import 'cypress-wait-until'

describe('Films', () => {
  before(() => {
    cy.initializeExperiments()
  })

  it('non pro paywall', () => {
    cy.visit('/films?q=test&playing=6127061')
    cy.waitUntil(() => {
      return cy.cyGet('paywall-button').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })
    cy.cyGet('paywall-button').should('exist')
  })

  it('pro paywall', () => {
    cy.login()
    cy.visit('/films?q=test&playing=6127061')
    cy.waitUntil(() => {
      return cy.cyGet('video-component').should('be.visible').then(() => true)
    }, { timeout: 10000, interval: 1000 })

    cy.cyGet('paywall-button').should('not.exist')
  })

  it('keyboard controls', {
      retries: {
        runMode: 2,
        openMode: 2
      }
    },
    () => {

      cy.visit('/films?q=test&playing=6127061')
      cy.waitUntil(() => {
        return cy.cyGet('video-component').should('be.visible').then(() => true)
      }, { timeout: 10000, interval: 1000 })
      cy.get('.video-player.col').click()
      cy.get('body').type(' ')
      cy.get('[floSvg="vid_play"]').should('not.be.visible')
    })
})
