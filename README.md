# hep-c-screener

a [CDS Hooks](http://cds-hooks.org/) hepatitis c screening service.

this service detects if a patient needs a hepatitis c screening per CDS recommended guidelines.  if a screening is required for a patient, it can be automatically ordered into the EHR system via [FHIR](http://www.hl7.org/implement/standards/fhir/) REST services, and/or administered via CDS hook card actions.  the service is highly configurable and easy to deploy.

rad! 💯

## usage

the screening service can be run in two different ways--via `docker` or via `nodejs`.  how to use either of these software tools is left as an exercise for the user.  ample tutorials are available for both toolchains via a quick internet search.

please see the [CDS Hooks](http://cds-hooks.org/) website to learn how to interact with a CDS Hooks web service.

### docker

`docker run -p <host-port>:8080 hep-c-screener`

### nodejs

nodejs 8.x or higher is required.

- install dependencies, `yarn`, or `npm install`
- run the server, `yarn start`, or `npm start`

### configuration

all configuration is delivered via environment variables.  how to set environment variables depends on the OS and deployment mechanism used.  how to set these variables is left as an exercise for the user.

### server

- `PORT`, HTTP port to run server on, defaults to 8080

### hepatitis c workflow

| variable                             | default                        | description                                                                                                                                                                                                             |
| ------------------------------------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DISABLE_DEFAULT_SCREENING_ORDER`    | <<unset>>                      | set this field to `1` to *_not_* order a HCV screen procedure by default. a card with a button to order the procedure will be presented                                                                                 |
| `HCV_SCREEN_OBSERVATION_LOINC_CODES` | `13955-0`                      | csv,of,codes to check is a HCV screen has been performed for a patient before                                                                                                                                                                                                       |
| `HCV_SCREEN_PROCEDURE_LOINC_CODE`    | `47365-2`                      | single code for ordering HCV screen                                                                                                                                                                                            |
| `HCV_SNOMED_CODES`                   | `128302006,50711007,235866006` | csv,of,codes to check if someone has or has had HCV                                                                                                                                                                        |
| `PROCEDURE_REQUEST_ORDER_INTENT`     | `proposal`                     | a [RequestIntent](https://www.hl7.org/fhir/valueset-request-intent.html) for the HCV screening order.  most likely, you will want `proposal` or `order`                                                                         |
| `PROCEDURE_REQUEST_ORDER_STATUS`     | `draft`                        | the default value for the `status` field of new HCV `ProcedureRequest`s. if providers want to immediately load the order into the EHR system, set this value to `active` |
| `VENIPUNCTURE_SNOMED_CODES`          | `22778000`                     | csv,of,codes to check for venipunction orders                                                                                                                                                                                                         |

if other code systems or codes themselves are required by default, please open a pull request

## fine print

- when testing to see if a patient already has an outstanding HCV procedure request, we check only the `HCV_SCREEN_PROCEDURE_LOINC_CODE`, and only if that procedure request status is `draft|active|completed`.  `cancelled|suspended` etc status codes still allow the service to create a new `HCV_SCREEN_PROCEDURE_LOINC_CODE` ProcedureRequest for the patient.

## contributing

see [CONTRIBUTING.md](./CONTRIBUTING.md)
