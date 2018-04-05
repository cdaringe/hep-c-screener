var CARD_SOURCE = {
  label: 'hep-c-screenr',
  url: 'https://example.com'
}

module.exports = function generateScreeningCards (opts) {
  if (!opts) throw new Error('card generator missing config object')
  if (!opts.screenProcedure) {
    throw new Error('card generator missing ProcedureRequest FHIR resource')
  }
  var cards = []
  var proposedProcedureCard = {
    summary: 'HCV Screen Proposed',
    indicator: 'info',
    detail: [
      'A HCV screening has been queued for this patient. Please',
      'promote the screening to a real procedure order or cancel it.'
    ].join(' '),
    source: CARD_SOURCE,
    suggestions: [
      {
        label: 'Actions',
        actions: [
          {
            type: 'update',
            description: 'Promote Screen',
            resource: Object.assign({}, opts.screenProcedure, {
              status: 'order'
            })
          },
          {
            type: 'delete',
            description: 'Cancel Screen',
            resource: `${opts.screenProcedure.resourceType}/${opts.screenProcedure.id}`
          }
        ]
      }
    ]
  }
  cards.push(proposedProcedureCard)
  return { cards }
}
