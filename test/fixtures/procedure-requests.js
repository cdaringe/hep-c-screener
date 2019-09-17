module.exports = {
  venipuncture: {
    resourceType: 'ProcedureRequest',
    id: '123',
    code: {
      coding: [
        {
          code: '22778000',
          display: 'venipuncture',
          system: 'http://snomed.org/snomed-ct'
        }
      ],
      text: 'venipuncture'
    },
    meta: {
      versionId: '1',
      lastUpdated: '2018-03-16T20:31:50.444+00:00'
    },
    status: 'active', // draft | active | suspended | completed | entered-in-error | cancelled
    intent: 'order', // proposal | plan | order
    subject: {
      reference: 'Patient/smart-5555003',
      display: 'Mildred'
    },
    requester: {
      agent: {
        reference: 'Practitioner/1403FM',
        display: '1403FM'
      },
      onBehalfOf: {
        reference: 'Organization/200313FM',
        display: 'BestProviders™'
      }
    },
    performer: {
      reference: 'Organization/FM',
      display: 'Crazy Guy with Needles'
    },
    reasonReference: [
      {
        reference: 'Condition/ABCDEFG123FM-cond-1',
        display: 'You just gotta do it'
      }
    ],
    specimen: [
      {
        reference: 'Specimen/SMP25049.01',
        display: 'Blood from Blood'
      }
    ],
    note: [
      {
        text: 'This is a request for a test'
      }
    ]
  }
}
