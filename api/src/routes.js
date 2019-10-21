import { Router } from 'express';

import PlanetController from './app/controllers/PlanetController';

const routes = new Router();

routes.get('/', async (request, response) => {
  return response.json({ message: 'Hello, World!' });
});

routes.post('/planets', PlanetController.store);

export default routes;
