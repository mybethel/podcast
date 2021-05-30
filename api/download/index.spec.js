/**
 * @jest-environment node
 */
const fetch = require('cross-fetch')
const request = require('supertest')

const handler = require('./')

jest.mock('cross-fetch')

describe('/download/:id', () => {
  it('requires the media ID as a parameter', async () => {
    expect((await request(handler).get('/download')).status).toBe(404)
    expect((await request(handler).get('/download/foo')).status).toBe(404)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('uses the API to lookup media', async () => {
    fetch.mockResolvedValue({ json: () => ({ data: null }) })
    await request(handler).get('/download/55d9ffb57c52600b006e5bdc.mp3')
    expect(fetch).toHaveBeenCalled()

    const { body } = fetch.mock.calls.pop().pop()
    expect(JSON.parse(body).variables).toBeDefined()
    expect(JSON.parse(body).variables.id).toBe('55d9ffb57c52600b006e5bdc')
  })

  it('returns a 404 when the media is not found', async () => {
    fetch.mockResolvedValue({ json: () => ({ data: { asset: null } }) })
    expect((await request(handler).get('/download/55d9ffb57c52600b006e5bdc')).status).toBe(404)
  })

  it('redirects to the underlying media url', async () => {
    fetch.mockResolvedValue({ json: () => ({ data: { asset: { url: 'https://player.vimeo.com/external/477368864.sd.mp4' } } }) })

    const { status, headers } = await request(handler).get('/download/55d9ffb57c52600b006e5bdc')
    expect(status).toBe(302)
    expect(headers.location).toContain('player.vimeo.com')
  })
})
