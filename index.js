const fetch = require('node-fetch')
const { send } = require('micro')

const feed = require('./feed')

/**
 * Microservice for rendering an iTunes-compatible XML podcast feed.
 */
module.exports = async (req, res) => {
  const id = req.url.match(/([\w\d]*)\.xml/)[1]
  if (!id) return send(res, 404)

  const payload = await getPodcast(id)
  fetch('https://api.bethel.io/performance/track', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'BethelPodcast/0.1 (+https://podcast.bethel.io)'
    },
    body: JSON.stringify({
      collection: 'podcast',
      podcast: payload.podcast._id,
      ministry: payload.ministry._id,
      ip_address: req.ip,
      user_agent: req.headers['user-agent']
    })
  })

  res.setHeader('Content-Type', 'text/xml; charset=UTF-8')
  send(res, 200, feed(payload))
}

/**
 * Get a Podcast from the API including all relevant media files and information
 * on the parent ministry which is required for the XML file.
 * @param {String} id - The Podcast ID from the API.
 * @return {Object}
 */
async function getPodcast (id) {
  const [ podcast, media ] = await Promise.all([
    api(`podcast/${id}`),
    api(`podcast/${id}/media?sort=-date`)
  ])

  const ministry = await api(`ministry/${podcast.ministry}`)

  return { podcast, media, ministry }
}

/**
 * Convenience wrapper for communicating via GET requests with the API.
 * @param {String} endpoint - The endpoint to hit.
 */
const api = (endpoint) => fetch(`https://api.bethel.io/${endpoint}`, {
  headers: {
    'User-Agent': 'BethelPodcast/0.1 (+https://podcast.bethel.io)'
  }
}).then(res => res.json()).then(res => res.data)
