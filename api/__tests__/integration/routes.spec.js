import supertest from 'supertest';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import app from '../../src/app';

const mockgoose = new Mockgoose(mongoose);

jest.useFakeTimers();
jest.setTimeout(450000);

const cleanUpDatabase = async () => {
  console.log('Cleaning up database...');
  await mockgoose.helper.reset();
  // await mockgoose.mongooseObj.connections[0].models.Planet.deleteMany();
  console.log('Finished cleaning up database...');
};

(async () => mockgoose.prepareStorage())();
// console.log(mockgoose.mongooseObj.connections[0]);

describe('Planets endpoints', () => {
  beforeEach(async () => cleanUpDatabase());

  afterEach(async () => {
    await cleanUpDatabase();
  });

  // afterAll(async () => {
  //   await mockgoose.mongooseObj.connections[0].close();
  //   console.log('Closing connection...');
  // });

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

  fit("should retrieve a planet by searching for it's id", async () => {
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    console.log(planet);
    expect(true).toBe(false);
    // const result = await supertest(app).get(`/planets/${planet._id}`);

    // expect(result.statusCode).toBe(200);
    // expect(result.body).toHaveProperty('_id');
    // expect(result.body).toHaveProperty('name');
    // expect(result.body).toHaveProperty('climate');
    // expect(result.body).toHaveProperty('terrain');
    // expect(result.body).toMatchObject({
    //   name: 'alderaan',
    //   climate: 'temperate',
    //   terrain: 'grasslands, mountains',
    // });
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
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app)
      .delete('/planets')
      .send({ id: planet._id });

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
    const planet = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    const result = await supertest(app)
      .delete('/planets')
      .send({ id: 'a' });

    expect(result.statusCode).toBe(400);
    expect(result.body).toMatchObject({
      error: 'Planet could not be deleted',
    });
  });
});
