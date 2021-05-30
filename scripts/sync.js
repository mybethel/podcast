const { resolve } = require('path')

const config = require('@nautilus/config')(resolve(__dirname, '../config'))
const { MongoClient } = require('mongodb')
const fetch = require('node-fetch')

;(async () => {
  const client = await MongoClient.connect(config.connections.mongo, {
    useUnifiedTopology: true
  })

  const cursor = client.db().collection('podcast').aggregate([
    { $match: { source: 2, deleted: { $ne: true } } },
    { $lookup: { from: 'service', localField: 'service', foreignField: '_id', as: 'service' } },
    { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } }
  ])

  // @TODO: Parallelize without blowing out our Rate Limit
  // @see https://developer.vimeo.com/guidelines/rate-limiting
  for await (const podcast of cursor) {
    const log = msg => console.log([podcast._id, podcast.name, msg].join(' - '))

    if (!podcast.service || !podcast.sourceMeta) {
      log('Vimeo account or tags not defined')
      continue
    }

    const results = await getVideos(podcast)
    log(`${results.length} matching videos`)

    throw new Error('@TODO')
  }

  console.log('done')
  process.exit(0)
})()

/**
 * Fetch all videos for the Podcast that match the defined tags.
 * @param {Object} podcast
 * @param {Number} page
 * @param {Array} result
 * @returns {Promise<Array>}
 */
const getVideos = async (podcast, page = 1, result = []) => {
  const { service: { accessToken }, sourceMeta } = podcast
  const tagsToSync = sourceMeta.toString().toLowerCase()

  console.log(`page ${page}`)
  const { paging, data } = await (await fetch(`https://api.vimeo.com/me/videos?page=${page}&per_page=100`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })).json()

  result.push(...data.filter(video => {
    // If a video is not marked as public it is ignored. In the future this
    // could be modified to allow private channels to be used as a source.
    if (video.privacy && video.privacy.view !== 'anybody') {
      return false
    }

    // Simple string matching is used to determine if any of the tags from
    // Vimeo match the tags passed to this function.
    const matches = video.tags.map(tag =>
      tagsToSync.indexOf(tag.name.toLowerCase()) >= 0
    ).filter(match => match === true)

    // If at least one tag matches, the video should be included.
    return matches.length > 0
  }))

  return paging.next
    ? getVideos(podcast, page + 1, result)
    : result
}
