import { Router } from 'express';

const routes = Router();
const axios = require('axios');

/**
 * GET home page
 */
routes.get('/hi', async(req, res) => {
  const catFacts = await getCatFacts();
  const joke = await getJoke();
  const tacos = await getTacos();
  const adresse = await getAdresse();
  const beer = await getBeer();
  res.send({gps :adresse , joke:joke , catFact: catFacts , beer: beer , taco: tacos});

});

/**
 * GET /list
 *
 * This is a sample route demonstrating
 * a simple approach to error handling and testing
 * the global error handler. You most certainly want to
 * create different/better error handlers depending on
 * your use case.
 */
routes.get('/list', (req, res, next) => {
  const { title } = req.query;

  if (title == null || title === '') {
    // You probably want to set the response HTTP status to 400 Bad Request
    // or 422 Unprocessable Entity instead of the default 500 of
    // the global error handler (e.g check out https://github.com/kbariotis/throw.js).
    // This is just for demo purposes.
    next(new Error('The "title" parameter is required'));
    return;
  }

  res.render('index', { title });
});

async function getCatFacts() {
  try {
    const { data } = await axios.get('http://cat-fact.herokuapp.com/facts/random?animal_type=cat&amount=3');
    return data.map(({ text }) => text )
  } catch (error) {
    return (error);
  }
}

async function getJoke() {
  try {
    const { data } = await axios.get('https://sv443.net/jokeapi/v2/joke/Programming/?type=single');
    return data.joke;
  } catch (error) {
    return (error);
  }
}

async function getTacos() {
  try {
    const { data } = await axios.get('http://taco-randomizer.herokuapp.com/random/?full-taco=true');
      return { taco_recepie : data.recipe }   ;
  } catch (error) {
    return (error);
  }
}

async function getAdresse() {
  try {
    const {data} = await axios.get('https://api-adresse.data.gouv.fr/search/?q=41+rue+du+port&postcode=59000&limit=1');
    const adresse = data.features[0].geometry.coordinates;
    return {lat : adresse[0] , lgn : adresse[1]};
  } catch (error) {
    return (error);
  }
}

async function getBeer() {
  try {
    const { data } = await axios.get('https://api.punkapi.com/v2/beers/random?amount=1');
    return {name : data[0].name , description :data[0].description };
  } catch (error) {
    return (error);
  }
}

export default routes;
