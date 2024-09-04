require('dotenv').config();

import { addFavorite, getFavorites, getTrips, removeFavorite } from './routes';

import { connectDB } from './config/database';
import express from 'express';
import swaggerDocument  from './config/swagger';
import swaggerUi from 'swagger-ui-express';

connectDB().catch(console.dir);

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/trips', getTrips);

app.post('/favorites/add', addFavorite);
app.get('/favorites/byUsername', getFavorites);
app.delete('/favorites/remove', removeFavorite);

export const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});

process.on( 'SIGTERM', function () {
    server.close(function () {
      console.log( "Closed out remaining connections.");
    });
 
 });
