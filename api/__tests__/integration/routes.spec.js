import supertest from 'supertest';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import app from '../../src/app';
// import '../../src/database';

// const mockgoose = new Mockgoose(mongoose);

// mongoose.connect('mongodb://localhost/b2w-test');

jest.useFakeTimers();
jest.setTimeout(450000);

// (async () => mockgoose.prepareStorage())();
// console.log(mockgoose.mongooseObj.connections[0]);

describe('Planets endpoints', () => {
  let planetId;

  beforeAll(async () => {
    await mongoose.models.Planet.deleteMany();
  });

  afterAll(async () => {
    await mongoose.models.Planet.deleteMany();
  });

  // beforeAll(async () => {
  //   await mockgoose.helper.reset();
  //   // await mockgoose.mongooseObj.connections[0].models.Planet.deleteMany();
  // });

  // afterAll(async () => {
  //   // await mockgoose.mongooseObj.connections[0].models.Planet.deleteMany();
  //   await mockgoose.helper.reset();
  //   await mockgoose.mongooseObj.connections[0].close();
  // });

  it('should create a planet in database if not exists', async () => {
    const result = await supertest(app)
      .post('/planets')
      .send({
        name: 'alderaan',
        climate: 'temperate',
        terrain: 'grasslands, mountains',
      });

    planetId = result.body._id;
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
    const result = await supertest(app).get('/allPlanets');

    expect(result.statusCode).toBe(200);
    expect(result.body.length).toBeGreaterThan(0);
  });

  it("should retrieve a planet by searching for it's id", async () => {
    const result = await supertest(app).get(`/planets/${planetId}`);

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
});
