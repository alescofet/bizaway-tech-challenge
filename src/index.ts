import express, { Request, Response } from 'express';

import { Trip } from './interfaces/trip';

require('dotenv').config()
const app = express();
const port = 3000;


app.get('/trips', async (req: Request, res: Response): Promise<void>  => {
    const queryParams = {
        destination: req.query.destination,
        origin: req.query.origin,
        sort_by: req.query.sort_by
    }

    const response = await fetch(`https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips?destination=${queryParams.destination}&origin=${queryParams.origin}`, {
        method: 'GET',
        headers: {
            'x-api-key': process.env.API_KEY ?? "",
            'Content-Type': "application/json"
        }
    })
    try {
        if (!response.ok) {
            throw new Error(`Error while fetching: ${response.statusText}`);
        }
        const data: Trip[] = await response.json();
        res.send(data)
    } catch (error: any) {
        console.error(error);
        res.send(error.toString())
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
