import express from 'express';
import cors from 'cors';

export const app = express();

app.use(cors({ origin: true }));

app.use(express.json());
app.use(express.raw({ type: 'application/vnd.custom-type' }));
app.use(express.text({ type: 'text/html' }));

// Healthcheck endpoint
app.get('/', (req, res) => {
  res.status(200).send({ status: 'ok' });
});

const api = express.Router();

api.get('/equipments', (req, res) => {
  fetch('https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false')
    .then(response => response.json())
    .then(data => res.send(data))
    .catch(error => console.error('Error:', error));
});

// Version the api
app.use('/api/v1', api);