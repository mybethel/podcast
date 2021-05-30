const escape = require('xml-escape')

module.exports = ({ ministry, podcast, media }) => (`
  <rss xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  <channel>
    <title>${escape(podcast.name)}</title>
    <link>${ministry.url || 'https://www.bethel.io/'}</link>
    <language>en-us</language>
    <copyright>&#169; ${podcast.owner || ministry.name}</copyright>
    <description>
      ${escape(podcast.description)}
    </description>
    <generator>https://www.bethel.io</generator>
    <itunes:owner>
      <itunes:name>${podcast.owner || ministry.name}</itunes:name>
      <itunes:email>${ministry.email || ''}</itunes:email>
    </itunes:owner>
    <itunes:summary>
      ${escape(podcast.description)}
    </itunes:summary>
    <itunes:author>${podcast.owner || ministry.name}</itunes:author>
    <itunes:explicit>no</itunes:explicit>
    <itunes:image href="${podcast.image.replace(/&/g, '&amp;')}"/>
    <itunes:keywords>${podcast.tags || ''}</itunes:keywords>
    <itunes:category text="Religion &amp; Spirituality">
      <itunes:category text="Christianity"/>
    </itunes:category>
    <itunes:new-feed-url>https://podcast.bethel.io/${podcast._id}.xml</itunes:new-feed-url>
    <atom:link href="https://podcast.bethel.io/${podcast._id}.xml" rel="self" type="application/rss+xml"/>
    ${media.map(media => !media.url
      ? ''
      : `<item>
        <title>${escape(media.name || media.url.split('/').pop())}</title>
        <pubDate>${new Date(media.date).toUTCString()}</pubDate>
        <guid isPermaLink="false">${media.url.replace(/&/g, '&amp;')}</guid>
        <itunes:author>${podcast.owner || ministry.name}</itunes:author>
        <description>
          ${escape(media.description || '')}
        </description>
        <itunes:duration>${media.duration}</itunes:duration>
        <enclosure url="${escape(media.url)}" length="${media.size}" type="${media.mime}"/>
        <itunes:explicit>no</itunes:explicit>
        <itunes:block>no</itunes:block>
      </item>`).join('')}
  </channel>
  </rss>
`)
