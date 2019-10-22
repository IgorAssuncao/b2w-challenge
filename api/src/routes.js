import { Router } from 'express';

import PlanetController from './app/controllers/PlanetController';

const routes = new Router();

routes.get('/', async (request, response) => {
  return response.json({ message: 'Hello, World!' });
});

routes.get('/allPlanets', PlanetController.list);
routes.get('/planets/:id', PlanetController.findById);
routes.get('/planets', PlanetController.findByName);
routes.post('/planets', PlanetController.create);
routes.delete('/planets', PlanetController.delete);

export default routes;
