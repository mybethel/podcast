const Vue = require('vue')

const renderer = require('vue-server-renderer').createRenderer({
  inject: false,
  template: result => `<?xml version="1.0" encoding="UTF-8" ?>
    <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
     ${result}
    </rss>`
})

/**
 * Render an RSS feed for the podcast with all relevant media.
 * @param {Object} data
 * @param {Object} data.podcast - Metadata about the podcast.
 * @param {Object} data.ministry - Metadata about the ministry.
 * @param {Array} data.media - Individual podcast episodes.
 */
module.exports = async data => (await renderer.renderToString(new Vue({
  data,
  computed: {
    feedUrl: vm => `https://podcast.bethel.io/${vm.podcast._id}.xml`
  },
  render (h) {
    return h('channel', [
      h('atom:link', {
        attrs: {
          href: this.feedUrl,
          rel: 'self',
          type: 'application/rss+xml'
        }
      }),
      h('title', this.podcast.name),
      h('language', 'en-us'),
      h('copyright', `© ${this.podcast.owner || this.ministry.name}`),
      h('description', this.podcast.description),
      h('generator', 'https://getbethel.com'),
      h('itunes:author', this.podcast.owner || this.ministry.name),
      h('itunes:category', { attrs: { text: 'Religion & Spirituality' } }, [
        h('itunes:category', { attrs: { text: 'Christianity' } })
      ]),
      h('itunes:explicit', 'no'),
      h('itunes:image', this.podcast.image),
      h('itunes:keywords', this.podcast.tags || ''),
      h('itunes:owner', [
        h('itunes:name', this.podcast.owner || this.ministry.name),
        h('itunes:email', this.ministry.email || '')
      ]),
      h('itunes:summary', this.podcast.description),
      ...this.media.filter(({ url }) => url).map(media =>
        h('item', [
          h('title', media.name || media.url.split('/').pop()),
          h('description', media.description || ''),
          h('enclosure', {
            attrs: {
              url: media.url,
              length: media.size,
              type: media.mime
            }
          }),
          h('pubDate', new Date(media.date).toUTCString()),
          h('guid', { attrs: { isPermaLink: false } }, media.url),
          h('itunes:author', this.podcast.owner || this.ministry.name),
          h('itunes:block', 'no'),
          h('itunes:duration', media.duration),
          h('itunes:explicit', 'no')
        ])
      )
    ])
  }
}))).replace(' data-server-rendered="true"', '')
