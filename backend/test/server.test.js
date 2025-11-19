const request = require('supertest')
const { server } = require('../server')

describe('Industrial Dashboard API', () => {
  afterAll(() => {
    server.close()
  })

  test('GET /api/equipment returns equipment data', async () => {
    const response = await request(server).get('/api/equipment')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('conveyor_1')
  })
})
