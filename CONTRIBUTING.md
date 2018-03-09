# contributing

- clone
- cd /path/to/project
- run `yarn` to install

## testing

### unit

- `yarn test`

### integration

- run your server locally, via `yarn start:watch`
- find an IP accessible to the CDS hook sandbox
- forward your dev server port to that cloud port: `ssh -R 8080:localhost:8080 user@example.com`
  - e.g. `ssh -R 8080:localhost:8080 -nNT root@$DROPLET_IP`
