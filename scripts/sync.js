const { resolve } = require('path')

const config = require('@nautilus/config')(resolve(__dirname, '../config'))
const { MongoClient } = require('mongodb')
const fetch = require('node-fetch')

const resolver = require('./resolver')

const API_PAGINATION = 100

;(async () => {
  const client = await MongoClient.connect(config.mongo.uri, config.mongo.options)

  const cursor = client.db().collection('podcast').aggregate([
    { $match: { source: 2, deleted: { $ne: true } } },
    { $lookup: { from: 'service', localField: 'service', foreignField: '_id', as: 'service' } },
    { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } }
  ])

  for await (const podcast of cursor) {
    const log = msg => console.log([podcast._id, podcast.name, msg].join(' - '))

    if (!podcast.service || !podcast.sourceMeta) {
      log('Vimeo account or tags not defined')
      continue
    }

    try {
      const results = await getVideos(podcast)
      log(`${results.length} matching videos`)

      console.log(resolver(results[0]))
    } catch (err) {
      log('Unexpected error encountered during sync:')
      console.error(err)
    }

    throw new Error('@TODO')
  }

  console.log('done')
  process.exit(0)
})()

/**
 * Basic wrapper around the Vimeo REST API.
 * @param {String} accessToken OAuth access token granted by the user.
 * @returns {Object}
 */
const vimeoApi = accessToken => ({
  fetch: async (page = 1) => (await fetch(
    `https://api.vimeo.com/me/videos?page=${page}&per_page=${API_PAGINATION}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )).json()
})

/**
 * Fetch all videos for the Podcast that match the defined tags.
 * @param {Object} podcast - The podcast to sync with Vimeo.
 * @returns {Promise<Array>}
 */
const getVideos = async (podcast) => {
  const { service: { accessToken }, sourceMeta } = podcast
  const tagsToSync = sourceMeta.toString().toLowerCase()

  const client = vimeoApi(accessToken)

  const { total, data } = await client.fetch()

  // Additional pages are parallelized. Since a Vimeo PRO plan is required, we
  // inherit a rate limit of 250rpm which gives us plenty of overhead for even
  // users with a relatively large number of videos.
  // @see https://developer.vimeo.com/guidelines/rate-limiting
  if (total > API_PAGINATION) {
    const additionalPages = Math.ceil((total - API_PAGINATION) / API_PAGINATION)
    const remaining = await Promise.all(new Array(additionalPages).fill().map((_, i) => client.fetch(i + 2)))

    data.push(...remaining.map(({ data }) => data).flat())
  }

  return data.filter(video => {
    // If a video is not marked as public it is ignored. In the future this
    // could be modified to allow private channels to be used as a source.
    if (video.privacy?.view !== 'anybody') {
      return false
    }

    // Simple string matching is used to determine if any of the tags from
    // Vimeo match the tags passed to this function.
    const matches = video.tags?.map(tag =>
      tagsToSync.indexOf(tag.name.toLowerCase()) >= 0
    ).filter(match => match === true)

    // If at least one tag matches, the video should be included.
    return matches?.length > 0
  })
}
