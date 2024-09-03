require('dotenv').config();

import { addFavorite, getFavorites, getTrips, removeFavorite } from './routes';

import { connectDB } from './database';
import express from 'express';

connectDB().catch(console.dir);

const app = express();
const port = 3000;

app.use(express.json());

app.get('/trips', getTrips);

app.post('/favorites/add', addFavorite);
app.get('/favorites/:username', getFavorites);
app.delete('/favorites/remove', removeFavorite);

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
