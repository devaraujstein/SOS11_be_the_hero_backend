import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import OngsController from './app/controllers/OngsController';
import IncidentsController from './app/controllers/IncidentsController';
import ProfileController from './app/controllers/ProfileController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.get('/ongs', OngsController.index);
routes.post('/ongs', OngsController.store);

routes.get('/incidents', IncidentsController.index);

routes.use(authMiddleware);

routes.get('/profile', ProfileController.index);
routes.post('/incidents', IncidentsController.store);
routes.delete('/incidents/:id', IncidentsController.delete);

export default routes;
