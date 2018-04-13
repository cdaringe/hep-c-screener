# hep-c-screenr

a CDS hook hepatitis c screening service.

this service detects if a patient needs a hepatitis c screening per CDS recommended guidelines.  if a screening is required for a patient, it can be automatically ordered into the EHR system via FHIR REST services.  care providers can also cancel the order.

rad! 💯

## usage

the screening service can be run in two different ways--via `docker` or via `nodejs`.  how to use either of these software tools is left as an exercise for the user.

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

- `HCV_SCREEN_OBSERVATION_LOINC_CODES`, csv,of,codes defaults to `13955-0`
- `HCV_SCREEN_PROCEDURE_LOINC_CODE`, code for ordering HCV screen, defaults to `47365-2`
- `HCV_SNOMED_CODES`, csv,of,codes to check if someone has/has-had HCV. defaults to `128302006,50711007,235866006`
- `VENIPUNCTURE_SNOMED_CODES`, csv,of,codes defaults to `22778000`
- `PROCEDURE_REQUEST_ORDER_INTENT`, defaults to `proposal`
  - a valid [ReferralRequest](https://www.hl7.org/fhir/valueset-request-intent.html) is required.  most likely, you will want `proposal` or `order`
- `PROCEDURE_REQUEST_ORDER_STATUS`, defaults to `draft`
  - any generated `ProcedureRequest` (using `HCV_SCREEN_PROCEDURE_LOINC_CODE`) will always be in `draft` state by default.  if providers want to immediately load the order into the EHR system, set this value to `active`

if other code systems or codes themselves are required by default, please open a pull request

## fine print

- when testing to see if a patient already has an outstanding HCV procedure request, we check only the `HCV_SCREEN_PROCEDURE_LOINC_CODE`, and only if that procedure request status is `draft|active|completed`.  `cancelled|suspended` etc status codes still allow the service to create a new `HCV_SCREEN_PROCEDURE_LOINC_CODE` ProcedureRequest for the patient.

## contributing

see [CONTRIBUTING.md](./CONTRIBUTING.md)
