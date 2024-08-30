import express, { Request, Response } from 'express';
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

type Filters = {
  global_search?: string | undefined;
  [key: string]: string | undefined;
};

api.get('/equipments', async (req: Request, res: Response) => {
  const filters: Filters = req.query as unknown as Filters;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = parseInt(req.query.offset as string) || 0;

  let finalUrl = `https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?limit=${limit}&offset=${offset}&timezone=UTC&include_links=false&include_app_metas=false`;
  let whereClauses: string[] = [];

  if (filters.global_search && filters.global_search.trim() !== '') {
    const globalSearch = filters.global_search.trim();
    whereClauses.push(`suggest(equip_nom,inst_nom,inst_com_nom,"${globalSearch}")`);
  }

  Object.entries(filters)
    .filter(([key, value]) => key !== 'global_search' && key !== 'limit' && key !== 'offset' && value && value.trim() !== '')
    .forEach(([key, value]) => {
      whereClauses.push(`${key}="${value?.trim()}"`);
    });

  if (whereClauses.length > 0) {
    const whereQuery = whereClauses.join('&where=');
    finalUrl += `&where=${whereQuery}`;
  }

  try {
    const response = await fetch(finalUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching equipments');
  }
});

api.get('/equipments/:equip_numero', async (req: Request, res: Response) => {
  const equip_numero = req.params.equip_numero;
  const equipmentUrl = `https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?timezone=UTC&include_links=false&include_app_metas=false&where=equip_numero="${equip_numero}"`;

  try {
    const response = await fetch(equipmentUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch equipment data, status code: ${response.status}`);
    }

    const data = await response.json();
    res.send(data);
  } catch (error) {
    console.error('Error fetching equipment by numero:', error);
    res.status(500).send('Error fetching equipment by numero');
  }
});


// Version the api
app.use('/api/v1', api);
