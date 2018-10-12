# contributing

- clone
- cd /path/to/project
- run `yarn` or `npm install` to install packages


## testing

### unit

- `yarn test` or `npm test`

### integration

- run your server locally, via `yarn start:watch` or `npm start`
- find an IP accessible to the CDS hook sandbox
  - wire in `https://r3.smarthealthit.org` to the sandbox for querying patients w/ HCV histories. see [here](https://dev.smarthealthit.org/#fhir-servers) for fhir servers.
    - Anthony Z Coleman (smart-1869612): Baby boomer w/ chronic Hep C
    - Mildred E Hoffman (smart-5555003): Baby bommer w/o Hep C or screening
    - use `https://patient-browser.smarthealthit.org/index.html?config=stu3-open-sandbox#/patient/3` to browse patients
- forward your dev server port to that cloud port: `ssh -R 8080:localhost:8080 user@example.com`
  - e.g. `ssh -R 8080:localhost:8080 -nNT root@$DROPLET_IP`
