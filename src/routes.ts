import { Request, Response } from 'express';
import { checkIATA, checkSortType, sortByCheapest, sortByFastest } from './utils';

import { Favorites } from './models/favorites';
import { Trip } from './interfaces/trip';

export async function getTrips(req: Request, res: Response): Promise<void> {
    const queryParams: { destination: string, origin: string, sort_by: string } = {
        destination: typeof req.query.destination === 'string' ? req.query.destination : "",
        origin: typeof req.query.origin === 'string' ? req.query.origin : "",
        sort_by: typeof req.query.sort_by === 'string' ? req.query.sort_by : ""
    };

    if (!queryParams.destination || !checkIATA(queryParams.destination)) {
        res.status(400).send("You must provide a valid destination");
        return;
    }
    if (!queryParams.origin || !checkIATA(queryParams.origin)) {
        res.status(400).send("You must provide a valid origin");
        return;
    }
    if (!queryParams.sort_by || !checkSortType(queryParams.sort_by)) {
        res.status(400).send("You must provide a valid sort order");
        return;
    }

    try {
        const response = await fetch(`https://z0qw1e7jpd.execute-api.eu-west-1.amazonaws.com/default/trips?destination=${queryParams.destination}&origin=${queryParams.origin}`, {
            method: 'GET',
            headers: {
                'x-api-key': process.env.API_KEY ?? "",
                'Content-Type': "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error while fetching: ${response.statusText}`);
        }

        const data: Trip[] = await response.json();

        if (queryParams.sort_by === "fastest") {
            res.json(sortByFastest(data));
        } else if (queryParams.sort_by === "cheapest") {
            res.json(sortByCheapest(data));
        } else {
            res.status(400).send("Invalid sort type");
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).send(error.toString());
    }
}

export async function addFavorite(req: Request, res: Response): Promise<void> {
    const { username, trip } = req.body;

    try {
        let favorites = await Favorites.findOne({ username });

        if (!favorites) {
            favorites = new Favorites({ username, trips: [] });
        }
        if(favorites.trips.find((t: Trip) => t.id === trip.id)){
            res.send(`This trip is already in favorites list for ${username}`)
        } else {
            favorites.trips.push(trip as Trip); 
            await favorites.save();    
            res.status(201).json(favorites);
        }
    } catch (error: any) {
        res.status(500).send(`Error adding favorite: ${error.message}`);
    }
}

export async function getFavorites(req: Request, res: Response): Promise<void> {
    const { username } = req.params;

    try {
        const favorites = await Favorites.findOne({ username });

        if (!favorites) {
            res.status(404).send('Favorites not found');
            return;
        }

        res.status(200).json(favorites);
    } catch (error: any) {
        res.status(500).send(`Error fetching favorites: ${error.message}`);
    }
}

export async function removeFavorite(req: Request, res: Response): Promise<void> {
    const { username, tripId } = req.body;

    try {
        const favorites = await Favorites.findOne({ username });

        if (!favorites) {
            res.status(404).send('User not found');
            return;
        }

        favorites.trips = favorites.trips.filter(
            (t: Trip) =>
                t.id !== tripId
        );

        await favorites.save();

        res.status(200).json(favorites);
    } catch (error: any) {
        res.status(500).send(`Error removing favorite: ${error.message}`);
    }
}


