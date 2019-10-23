import supertest from 'supertest';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import app from '../../src/app';

const mockgoose = new Mockgoose(mongoose);

jest.useFakeTimers();
jest.setTimeout(450000);

(async () => mockgoose.prepareStorage())();

const cleanUpDatabase = async () => {
  // await mockgoose.mongooseObj.connections.forEach(connection =>
  //   connection.models.Planet.deleteMany()
  // );
  await mongoose.models.Planet.deleteMany();
};

describe('Planets endpoints', () => {
  beforeEach(async () => cleanUpDatabase());

  afterEach(async () => cleanUpDatabase());

  beforeAll(async () => cleanUpDatabase());

  afterAll(async () => {
    await cleanUpDatabase();
    await mockgoose.mongooseObj.connections.forEach(connection =>
      connection.close()
    );
  });

  it('should create a planet in database if not exists', async () => {
    const result = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    expect(result.statusCode).toEqual(201);
    expect(result.body).toHaveProperty('_id');
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('climate');
    expect(result.body).toHaveProperty('terrain');
    expect(result.body).toMatchObject({
      name: 'alderaan',
      climate: 'temperate',
      terrain: 'grasslands, mountains',
    });
  });

  it('should not create a planet in database if exists', async () => {
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    expect(result.statusCode).toEqual(400);
    expect(result.body).toEqual({ error: 'This planet already exists' });
  });

  it('should retrieve all planets', async () => {
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app).get('/allPlanets');

    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBeGreaterThan(0);
  });

  it("should retrieve a planet by searching for it's id", async () => {
    const response = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app).get(`/planets/${response.body._id}`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty('_id');
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('climate');
    expect(result.body).toHaveProperty('terrain');
    expect(result.body).toMatchObject({
      name: 'alderaan',
      climate: 'temperate',
      terrain: 'grasslands, mountains',
    });
  });

  it("should retrieve a planet by searching for it's name", async () => {
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app).get(`/planets/?name=alderaan`);

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty('_id');
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('climate');
    expect(result.body).toHaveProperty('terrain');
    expect(result.body).toMatchObject({
      name: 'alderaan',
      climate: 'temperate',
      terrain: 'grasslands, mountains',
    });
  });

  it('should delete a planet given the id', async () => {
    const response = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app)
      .delete('/planets')
      .send({ id: response.body._id });

    expect(result.statusCode).toBe(200);
    expect(result.body).toHaveProperty('_id');
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('climate');
    expect(result.body).toHaveProperty('terrain');
    expect(result.body).toMatchObject({
      name: 'alderaan',
      climate: 'temperate',
      terrain: 'grasslands, mountains',
    });
  });

  it('should not delete a planet if the given id is invalid', async () => {
    await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app)
      .delete('/planets')
      .send({ id: '5db0e6ac88bc552f2392cc6a' });

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      error: 'Planet could not be deleted',
    });
  });
});
