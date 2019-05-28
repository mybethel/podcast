const { send } = require('micro')
const { parse } = require('path')

const client = require('./client')
const feed = require('./feed')

/**
 * Microservice for rendering an iTunes-compatible XML podcast feed.
 */
module.exports = async (req, res) => {
  const path = parse(req.url)
  if (path.ext !== '.xml' || !path.name) return send(res, 404)

  const payload = await getPodcast(path.name)
  client.post('performance/track', {
    collection: 'podcast',
    podcast: payload.podcast._id,
    ministry: payload.ministry._id,
    ip_address: req.ip,
    user_agent: req.headers['user-agent']
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
    client.get(`podcast/${id}`),
    client.get(`podcast/${id}/media?sort=-date&limit=999`)
  ])

  const ministry = await client.get(`ministry/${podcast.ministry}`)

  return { podcast, media, ministry }
}
