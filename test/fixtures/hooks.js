var procedureRequests = require('./procedure-requests')

var mildredVenipuncture = {
  hook: 'order-review',
  hookInstance: 'd80451db-928e-43d4-9145-a36ff6b7283c',
  fhirServer: 'https://r3.smarthealthit.org',
  redirect: 'http://sandbox.cds-hooks.org/service-done.html',
  user: 'Practitioner/example',
  patient: 'smart-5555003',
  context: {
    orders: [procedureRequests.venipuncture]
  },
  prefetch: {
    patient: {
      resource: {
        resourceType: 'Patient',
        id: 'smart-5555003',
        meta: {
          versionId: '1',
          lastUpdated: '2018-01-12T20:51:13.000+00:00',
          tag: [
            {
              system: 'https://smarthealthit.org/tags',
              code: 'smart-7-2017'
            }
          ]
        },
        text: {
          status: 'generated',
          div: '<div xmlns="http://www.w3.org/1999/xhtml">Mildred Hoffman</div>'
        },
        identifier: [
          {
            use: 'official',
            type: {
              coding: [
                {
                  system: 'http://hl7.org/fhir/v2/0203',
                  code: 'MR',
                  display: 'Medical Record Number'
                }
              ],
              text: 'Medical Record Number'
            },
            system: 'http://hospital.smarthealthit.org',
            value: 'smart-5555003'
          }
        ],
        active: true,
        name: [
          {
            use: 'official',
            family: 'Hoffman',
            given: ['Mildred', 'E']
          }
        ],
        telecom: [
          {
            system: 'email',
            value: 'mildred.hoffman@example.com'
          }
        ],
        gender: 'female',
        birthDate: '1952-05-12',
        address: [
          {
            use: 'home',
            line: ['2001 Airport Road'],
            city: 'Morrisville',
            state: 'NC',
            postalCode: '27560',
            country: 'USA'
          }
        ],
        generalPractitioner: [
          {
            reference: 'Practitioner/smart-Practitioner-71482713'
          }
        ]
      },
      response: {
        status: '200'
      }
    }
  }
}

module.exports = {
  orderReview: {
    mildredVenipuncture
  }
}
