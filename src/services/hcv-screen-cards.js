// TODO: Update the URL
var CARD_SOURCE = {
  label: 'hep-c-screener',
  url: 'finalProdServerAddress'
}

var DEFAULT_SCREEN_CARD = {
  summary: 'HCV Screening Required',
  indicator: 'info',
  detail: [
    'Patient should be screened for Hepatitis C Virus (HCV) infection,',
    'as recommended by CDC and USPSTF'
  ].join(' '),
  source: CARD_SOURCE,
  links: [
    {
      label: 'CDC',
      url: 'https://www.cdc.gov/mmwr/preview/mmwrhtml/rr6104a1.htm'
    },
    {
      label: 'USPSTF',
      url: 'https://www.uspreventiveservicestaskforce.org/Page/Document/RecommendationStatementFinal/hepatitis-c-screening'
    }
  ]
}

function screenOrdered (opts) {
  if (!opts) throw new Error('card generator missing config object')
  if (!opts.screenProcedure) {
    throw new Error('card generator missing ProcedureRequest FHIR resource')
  }
  var cards = []
  var card = Object.assign(
    DEFAULT_SCREEN_CARD,
    {
      suggestions: [
        {
          label: 'Promote',
          actions: [
            {
              type: 'update',
              description: 'Promote Screen',
              resource: Object.assign({}, opts.screenProcedure, {
                status: 'order'
              })
            }
          ]
        },
        {
          label: 'Delete',
          uuid: 123,
          actions: [
            {
              type: 'delete',
              description: 'Cancel Screen',
              resource: `${opts.screenProcedure.resourceType}/${
                opts.screenProcedure.id
              }`
            }
          ]
        }
      ]
    }
  )
  cards.push(card)
  return { cards }
}

function screenProposed (opts) {
  if (!opts) throw new Error('card generator missing config object')
  if (!opts.createScreenPayload) {
    throw new Error('screening order payload missing')
  }
  var cards = []
  var card = Object.assign(
    DEFAULT_SCREEN_CARD,
    {
      suggestions: [
        {
          label: 'Order Screening',
          actions: [
            {
              type: 'create',
              description: 'Order Screening Now',
              resource: opts.createScreenPayload
            }
          ]
        }
      ]
    }
  )
  cards.push(card)
  return { cards }
}

module.exports = {
  screenOrdered,
  screenProposed
}
