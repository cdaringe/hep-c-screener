// TODO: Update the URL
var CARD_SOURCE = {
  label: 'hep-c-screenr',
  url: 'finalProdServerAddress'
}

module.exports = function generateScreeningCards (opts) {
  if (!opts) throw new Error('card generator missing config object')
  if (!opts.screenProcedure) {
    throw new Error('card generator missing ProcedureRequest FHIR resource')
  }
  var cards = []
  var proposedProcedureCard = {
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
    ],
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
  cards.push(proposedProcedureCard)
  return { cards }
}
