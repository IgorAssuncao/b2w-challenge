import axios from 'axios';

import * as Yup from 'yup';

import Planet from '../schemas/Planet';

class PlanetController {
  async list(request, response) {
    const planets = await Planet.find({}, { __v: false });

    if (!planets)
      return response.status(400).json({
        message: 'None planet found',
      });

    return response.json(planets);
  }

  async findById(request, response) {
    const planet = await Planet.findById(request.params.id, { __v: false });

    if (!planet)
      return response.status(400).json({ error: 'Planet not found' });

    return response.json(planet);
  }

  async findByName(request, response) {
    const planet = await Planet.find(
      { name: request.query.name },
      { __v: false }
    );

    if (!planet)
      return response.status(400).json({ error: 'Planet not found' });

    return response.json(planet[0]);
  }

  async create(request, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      climate: Yup.string().required(),
      terrain: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Some data is missing,  please try again.' });
    }

    const planetInfo = await axios.get(
      `https://swapi.co/api/planets/?search=${request.body.name}`,
      {
        timeout: 1000 * 60 * 30,
      }
    );

    if (!planetInfo.data.count)
      return response.status(400).json({ error: 'Planet not found' });

    const { name, climate, terrain } = request.body;

    const planetQueryResult = await Planet.find(
      {
        name,
        climate,
        terrain,
      },
      { __v: false }
    );

    if (planetQueryResult.length > 0) {
      return response.status(400).json({ error: 'This planet already exists' });
    }

    const planet = await Planet.create({
      name,
      climate,
      terrain,
      filmsApparitionsCount: planetInfo.data.results[0].films.length,
    });

    return response.status(201).json({
      _id: planet._id,
      name: planet.name,
      climate: planet.climate,
      terrain: planet.terrain,
      filmsApparitionsCount: planet.filmsApparitionsCount,
    });
  }

  async delete(request, response) {
    const schema = Yup.object().shape({
      id: Yup.string().required(),
    });

    if (!(await schema.isValid(request.body))) {
      return response
        .status(400)
        .json({ error: 'Some data is missing,  please try again.' });
    }

    const deletedPlanet = await Planet.findByIdAndDelete(request.body.id, {
      __v: false,
    });

    if (!deletedPlanet)
      return response
        .status(400)
        .json({ error: 'Planet could not be deleted' });

    return response.json({
      message: 'Planet deleted',
      deletedPlanet,
    });
  }
}

export default new PlanetController();
