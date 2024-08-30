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
  const filters: Filters = req.query as unknown as Filters; // Type assertion pour les filtres
  let finalUrl = 'https://equipements.sports.gouv.fr/api/explore/v2.1/catalog/datasets/data-es/records?limit=10&offset=0&timezone=UTC&include_links=false&include_app_metas=false';
  let whereClauses: string[] = [];

  if (filters.global_search && filters.global_search.trim() !== '') {
    const globalSearch = filters.global_search.trim();
    whereClauses.push(`suggest(equip_nom,inst_nom,inst_com_nom,"${globalSearch}")`);
  }

  Object.entries(filters)
    .filter(([key, value]) => key !== 'global_search' && value && value.trim() !== '') // Exclure 'global_search' et les valeurs vides
    .forEach(([key, value]) => {
      whereClauses.push(`${key}="${value?.trim()}"`);
    });

  if (whereClauses.length > 0) {
    const whereQuery = whereClauses.join('&where=');
    finalUrl += `&where=${whereQuery}`; // Utiliser '&where=' pour séparer les clauses
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

// Version the api
app.use('/api/v1', api);
