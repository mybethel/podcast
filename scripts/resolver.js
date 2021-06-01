const withResolvers = resolvers => obj =>
  Object.entries(resolvers).reduce((acc, [key, func]) => {
    acc[key] = func(obj)
    return acc
  }, {})

/**
 * Map the fields returns by the Vimeo API to our document model.
 * @param {Object} video - The video file returned by Vimeo.
 * @returns {Object}
 */
module.exports = withResolvers({
  uuid: ({ uri }) => uri.toString().replace('/videos/', ''),
  name: ({ name }) => name?.trim(),
  date: video => new Date(video.created_time),
  description: ({ description }) => description?.trim(),
  tags: ({ tags }) => tags?.map(({ name }) => name.trim()),
  duration: ({ duration }) => duration,
  thumbnail: ({ pictures }) => pictures?.reduce((a, b) => a.width > b.width ? a : b).link,
  url: ({ files }) => files?.find(({ quality }) => quality === 'sd')?.link_secure,
  variants: ({ files }) => files?.reduce((result, file) => {
    result[file.quality] = file.link_secure
    return result
  }, {})
})
