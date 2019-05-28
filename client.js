const fetch = require('node-fetch')

const { name, version } = require('./package.json')

const userAgent = `${name}/${version} (+https://getbethel.com)`

/**
 * GET
 * @param {String} endpoint - The endpoint to hit.
 */
exports.get = (endpoint) => fetch(`https://api.bethel.io/${endpoint}`, {
  headers: { 'User-Agent': userAgent }
}).then(res => res.json()).then(res => res.data)

/**
 * POST
 * @param {String} endpoint - The endpoint to hit.
 * @param {Object} payload - The POST body which will be encoded as JSON.
 */
exports.post = (endpoint, payload) => fetch(`https://api.bethel.io/${endpoint}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': userAgent
  },
  body: JSON.stringify(payload)
})
