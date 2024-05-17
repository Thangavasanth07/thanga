import 'cypress-wait-until'

    /**
     * Query Tests
     */
     describe('When a user changes results', () => {
      it('should update the search box, tab, clear results, and update page', () => {
        // Search Input
        cy.visit('/search')
        cy.cyGet('search-box').children('input[type="text"]').first().safeType('test').should('have.value', 'test')
        cy.url().should('include', '/search?q=test')

        cy.cyGet('clear-search-btn').click({ force: true })
        cy.url().should('include', '/search')

        // No Results
        cy.cyGet('search-box').children('input[type="text"]').first().safeType('dfksahfasjf')
        cy.waitUntil(() => {
          return cy.cyGet('search-no-results').should('be.visible').then(() => true)
        }, { timeout: 10000, interval: 1000 })
        cy.cyGet('search-no-results')
        cy.wait(1000)
        cy.waitUntil(() => {
          return cy.cyGet('clear-search-btn').should('be.visible').then(() => true)
        }, { timeout: 10000, interval: 1000 })
        cy.cyGet('clear-search-btn').click({ force: true })
        cy.waitUntil(() => {
          return cy.url().then(url => {
            return !url.includes('dfksahfasjf', { timeout: 10000, interval: 1000 })
          })
        })

        cy.url().should('include', 'search?page=1')

        // Tabs
        cy.get('[data-test="search-tab-item"] > a').eq(1).click({ force: true })

        cy.url().should('include', '/search?page=1&type=event')

        cy.get('[data-test="search-tab-item"] > a').eq(2).click({ force: true })

        cy.url().should('include', '/search?page=1&type=video')

        cy.get('[data-test="search-tab-item"] > a').first().click({ force: true })
        cy.url().should('include', '/search?page=1')

        // Pagination
        cy.get('[data-test="pagination"] li.page-item > a').eq(2).click({ force: true })
        cy.url().should('include', '/search?page=2')
      })
    })
