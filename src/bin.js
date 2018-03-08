require('perish')
if (!process.env.NODE_ENV) {
  console.error(
    [
      'please set a NODE_ENV environment variable. ',
      'for example, add \n\n\texport NODE_ENV=development\n\n',
      'into your .bashrc or simply run NODE_ENV=development <script>'
    ].join('')
  )
  process.exit(1)
}
var Service = require('./')
var service = new Service()
service.start()
