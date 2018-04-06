import 'isomorphic-fetch';
import express from 'express';

import restRoutes from './rest';
import appRoute from './app';
import logger from './logger';


const app = express();

app.use(logger);
app.use(express.static('dist'));
app.use(restRoutes);
app.use(appRoute);

export default app;
