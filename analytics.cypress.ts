describe.skip('Analytics', () => {
  getAnalyticsEvents().forEach(analyticsEvent => {
    if (!!(analyticsEvent as any).only) {
      it.only(analyticsEvent.trigger, () => doAnalyticsTest(analyticsEvent))
    } else if (!!(analyticsEvent as any).skip) {
      it.skip(analyticsEvent.trigger, () => doAnalyticsTest(analyticsEvent))
    } else {
      it(analyticsEvent.trigger, () => doAnalyticsTest(analyticsEvent))
    }
  })
})

function doAnalyticsTest(analyticsEvent: any) {
  cy.visit(analyticsEvent.url)
  setupAnalytics()
  cy.get(analyticsEvent.selector).first().scrollIntoView().click({ force: true })
  validateAnalytics(analyticsEvent)
}

function setupAnalytics() {
  cy.server()
  cy.route({
    url: 'https://siop.flosports.tv/v1/t',
    method: 'post'
  }).as('track')
}

function validateAnalytics(inputAnalytics: any) {
  cy.wait('@track').then(xhr => {
    const postBody = xhr.request.body
    Object.keys(inputAnalytics.properties).forEach(key => {
      const recievedValue = (postBody as any).properties[key] === null ? undefined : (postBody as any).properties[key]
      const expectedValue = inputAnalytics.properties[key]

      const isType = (value: any) => value[0] === '<' && value[value.length - 1] === '>'

      const isEnum = (value: any) => value[0] === '[' && value[value.length - 1] === ']'

      const isRegExp = (value: any) => value[0] === '/' && value[value.length - 1] === '/'

      if (isType(expectedValue)) {
        const type = expectedValue.substring(1, expectedValue.length - 1)
        if (type.indexOf(',') > -1) {
          expect(
            type.split(',').map((out: any) => out.trim()),
            `expect ${recievedValue} to have one of type ${type}`
          ).to.include(typeof recievedValue)
        } else {
          expect(recievedValue, `expect ${recievedValue} to have type ${type}`).to.be.a(type)
        }
      } else if (isEnum(expectedValue)) {
        const possibleValues = expectedValue
          .substring(1, expectedValue.length - 1)
          .split(',')
          .map((value: any) => value.trim())
        expect(possibleValues, `expect ${recievedValue} to be a member of ${possibleValues}`).to.include(recievedValue)
      } else if (isRegExp(expectedValue)) {
        const regexp = expectedValue.substring(1, expectedValue.length - 1)
        // tslint:disable
        expect(new RegExp(regexp).test(recievedValue), `expect ${recievedValue} to match regular expression ${regexp}`)
          .to.be.true
      } else {
        expect(recievedValue, `expect ${recievedValue} to equal ${expectedValue}`).to.equal(expectedValue)
      }
    })
    expect((xhr.response?.body as any).success, 'success response').to.be.true
  })
}

function getAnalyticsEvents() {
  return [
    {
      event: 'Link Clicked',
      properties: {
        name: '<string>',
        node_id: '<number>',
        events_this_day: '<number>',
        item_order: '<number>'
      },
      notes: ['user clicks any event on the schedule'],
      platform: 'Web',
      trigger: 'user clicks any event on the schedule',
      url: '/events',
      selector: '.row[id*="eventId"] a'
    },
    {
      event: 'Link Clicked',
      properties: {
        live_id: '<number>',
        event_status: '[pre-air, live, intermission,concluded]'
      },
      notes: [
        'user clicks on any event on the schedule, the item_order is the index of the event in the events for that day'
      ],
      skip: true,
      platform: 'Web',
      trigger:
        'user clicks on any event on the schedule, the item_order is the index of the event in the events for that day',
      url: '/events',
      selector: '.row[id*="eventId"] a[href^="/live"]'
    },
    {
      event: 'Link Clicked',
      properties: {
        name: 'Watch',
        node_id: '<number>',
        live_id: '<number>',
        events_this_day: '<number>',
        item_order: '<number>'
      },
      notes: ['user clicks on "Watch" link'],
      platform: 'Web',
      trigger: 'user clicks on "Watch on $VerticalName" link',
      url: '/events',
      skip: true,
      selector: 'a[name*="Watch"]'
    },
    {
      event: 'Link Clicked',
      properties: {
        name: 'Replays',
        node_id: '<number>',
        live_id: '<number>',
        events_this_day: '<number>',
        item_order: '<number>'
      },
      notes: ['user clicks on "Watch replay" link'],
      platform: 'Web',
      trigger: 'user clicks on "Watch replay" link',
      url: '/events',
      selector: 'a[name="Replays"]'
    },
    {
      event: 'Link Clicked',
      properties: { name: 'Subscribe to Full Event Calendar' },
      notes: ['user clicks on the calendar button event list'],
      skip: true,
      platform: 'Web',
      trigger: 'user clicks on the calendar button event list',
      url: '/events',
      selector: 'label[for="show-add-to-calendar"]'
    },
    {
      event: 'Link Clicked',
      properties: { name: '[google calendar, iCalendar, Outlook]' },
      notes: ['user clicks on the calendar link event list'],
      platform: 'Web',
      trigger: 'user clicks on the calendar link event list',
      url: '/events',
      selector: '#add-to-calendar a'
    },
    {
      event: 'Button Clicked',
      properties: { name: 'Jump to Today' },
      notes: ['user clicks on the "today" button'],
      platform: 'Web',
      trigger: 'user clicks on the "today" button',
      url: '/events',
      selector: 'a#today'
    },
    {
      event: 'Document Scrolled',
      properties: {
        name: 'Timeline Scrolled',
        timestamp: '<number>',
        events_this_day: '<number>'
      },
      notes: ['user scrolls the timeline up or down'],
      platform: 'Web',
      trigger: 'user scrolls the timeline up or down',
      url: '/events',
      selector: 'ol#date-list > li'
    }
  ]
}
