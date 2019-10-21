import axios from 'axios';

import * as Yup from 'yup';

import Planet from '../schemas/Planet';

class PlanetController {
  async store(request, response) {
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
      `https://swapi.co/api/planets/?search=${request.body.name}`
    );

    if (!planetInfo.data.count)
      return response.status(404).json({ error: 'Planet not found' });

    const { name, climate, terrain } = request.body;

    const planet = await Planet.create({
      name,
      climate,
      terrain,
      filmsApparitionsCount: planetInfo.data.results[0].films.length,
    });

    return response.json(planet);
  }
}

export default new PlanetController();
