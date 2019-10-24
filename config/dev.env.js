'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"//recapi.meite.com/"',
  ENV_CONFIG: '"dev"',
  WXAPPID: '""'
})
