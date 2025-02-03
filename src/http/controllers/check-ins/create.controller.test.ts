import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create Check-in (E2E)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Usando diretamente o prisma
    const gym = await prisma.gym.create({
      data: {
        title: 'Javascript gym',
        description: 'Some description.',
        phone: '1199999999',
        latitude: -26.7201952,
        longitude: -48.6899712,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -26.7201952,
        longitude: -48.6899712,
      })

    expect(response.statusCode).toEqual(201)
  })
})
