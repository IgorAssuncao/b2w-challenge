#### Instructions

##### To run the application:
Start by opening up the terminal and run `git clone https://github.com/IgorAssuncao/b2w-challenge.git && cd b2w-challenge`

Create a .env file like:
```
NODE_ENV=development
```

Then run `docker-compose up --build` to run the environment.

##### To use the API:
To create a planet make a POST request at `localhost:3000/planets` passing an object like this
```
{
  "name": "alderaan",
  "climate": "temperate",
  "terrain": "grasslands, mountains"
}
```

To list all planets that have been previously input make a GET request at `localhost:3000/allPlanets`

To search for a specific planet by it's ID make a GET request at `localhost:3000/planets/:id` (note that `:id` has to be replaced by the ID provided by the API that was returned when you created a planet)

To delete a planet make a POST request at `localhost:3000/planets` providing an object like this
```
{
  "id": ":id"
}
```
(note that `:id` has to be replaced by the ID provided by the API that was returned when you created a planet)

#### To run the tests:

