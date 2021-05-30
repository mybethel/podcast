const fetch = require('cross-fetch')
const { nautilus } = require('@nautilus/micro')

module.exports = nautilus(async (req, res) => {
  const id = req.url.split('/').pop().split('.').shift()
  if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) return res.notFound()

  const { data } = await fetch('https://platform.bethel.now.sh/graphql', {
    method: 'POST',
    headers: {
      'ApolloGraphQL-Client-Name': 'io.bethel.podcast',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `
        query DownloadPodcastMedia ($id: ID!) {
          asset (id: $id) {
            url
          }
        }
      `,
      variables: { id }
    })
  }).then(res => res.json())

  if (!data || !data.asset) return res.notFound()

  res.setHeader('Location', data.asset.url)
  res.status(302).send()
})
